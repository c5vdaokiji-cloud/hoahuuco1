
import React, { useState, useEffect, useRef } from 'react';
import { Home, Beaker, CheckCircle2, XCircle, ChevronRight, Heart, Sparkles, Flame, Smile, Frown, Lightbulb, Star, Zap, HelpCircle, BookX, ZoomIn, X } from 'lucide-react';
import { Question } from '../types';

interface QuizScreenProps {
  questions: Question[];
  onBack: () => void;
  onComplete: (score: number, total: number, wrongQuestions: Question[]) => void;
}

// Internal Component for Burst Feedback
interface BurstParticle {
  id: number;
  x: number;
  y: number;
  tx: number; // target x translation
  ty: number; // target y translation
  r: number; // rotation
  color: string;
  Icon: React.ElementType;
  size: number;
}

interface FloatingText {
  id: number;
  x: number;
  y: number;
  text: string;
  color: string;
  rotation: number;
  scale: number;
}

const QuizScreen: React.FC<QuizScreenProps> = ({ questions, onBack, onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [isAnswered, setIsAnswered] = useState(false);
  
  // New State for features
  const [wrongQuestions, setWrongQuestions] = useState<Question[]>([]);
  const [shake, setShake] = useState(false);
  const [streak, setStreak] = useState(0); 
  const [avatarState, setAvatarState] = useState<'neutral' | 'happy' | 'sad'>('neutral');
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

  // Interaction Effects State
  const [burstParticles, setBurstParticles] = useState<BurstParticle[]>([]);
  const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([]);

  // Sound Refs
  const correctAudioRef = useRef<HTMLAudioElement | null>(null);
  const wrongAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Initialize Audio objects with reliable SFX urls
    correctAudioRef.current = new Audio('https://assets.codepen.io/21542/howler-sfx-levelup.mp3');
    correctAudioRef.current.volume = 0.6;
    
    wrongAudioRef.current = new Audio('https://assets.codepen.io/21542/howler-push.mp3');
    wrongAudioRef.current.volume = 0.5;
  }, []);

  if (!questions || questions.length === 0) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center text-white p-4">
            <h2 className="text-2xl font-bold mb-4">Không tìm thấy câu hỏi</h2>
            <button onClick={onBack} className="bg-pink-600 hover:bg-pink-500 text-white font-bold py-2 px-4 rounded">
                Quay lại
            </button>
        </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  // Safety check for currentQuestion to prevent "reading 'options' of undefined"
  if (!currentQuestion) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center text-white p-4">
            <h2 className="text-2xl font-bold mb-4">Lỗi tải câu hỏi</h2>
            <button onClick={onBack} className="bg-pink-600 hover:bg-pink-500 text-white font-bold py-2 px-4 rounded">
                Quay lại
            </button>
        </div>
      );
  }

  const progress = ((currentIndex + 1) / questions.length) * 100;

  const playFeedbackSound = (isCorrect: boolean) => {
    try {
      if (isCorrect && correctAudioRef.current) {
        correctAudioRef.current.currentTime = 0;
        correctAudioRef.current.play().catch(e => console.log("Audio blocked", e));
      } else if (!isCorrect && wrongAudioRef.current) {
        wrongAudioRef.current.currentTime = 0;
        wrongAudioRef.current.play().catch(e => console.log("Audio blocked", e));
      }
    } catch (error) {
      console.error("Audio playback error", error);
    }
  };

  const createBurst = (x: number, y: number, isCorrect: boolean) => {
    const particleCount = 20; 
    const newParticles: BurstParticle[] = [];
    const colors = isCorrect 
      ? ['#f472b6', '#fb7185', '#ffffff', '#fbbf24', '#e879f9'] 
      : ['#9ca3af', '#ef4444', '#7f1d1d', '#525252']; 

    const Icons = isCorrect ? [Heart, Star, Sparkles, Zap] : [XCircle, Frown];

    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount;
      const velocity = 30 + Math.random() * 60; 
      
      newParticles.push({
        id: Date.now() + i,
        x,
        y,
        tx: Math.cos(angle) * velocity,
        ty: Math.sin(angle) * velocity,
        r: Math.random() * 360,
        color: colors[Math.floor(Math.random() * colors.length)],
        Icon: Icons[Math.floor(Math.random() * Icons.length)],
        size: Math.random() * 16 + 8,
      });
    }

    setBurstParticles(prev => [...prev, ...newParticles]);
    
    setTimeout(() => {
        setBurstParticles(prev => prev.slice(particleCount));
    }, 600);
  };

  const createFloatingText = (x: number, y: number, isCorrect: boolean, currentStreak: number) => {
      let text = "";
      if (isCorrect) {
          if (currentStreak >= 5) text = "Đỉnh cao! 🔥";
          else if (currentStreak >= 3) text = "Tuyệt vời! 😍";
          else text = "+1 Chính xác! ❤️";
      } else {
          text = "Tiếc quá! 💔";
      }

      const color = isCorrect 
        ? (currentStreak >= 3 ? "text-yellow-300 drop-shadow-[0_0_10px_rgba(234,179,8,0.5)]" : "text-green-400") 
        : "text-red-400";
      
      const id = Date.now();
      const rotation = (Math.random() - 0.5) * 30; 
      const scale = isCorrect && currentStreak >= 3 ? 1.5 : 1;

      setFloatingTexts(prev => [...prev, { id, x, y, text, color, rotation, scale }]);

      setTimeout(() => {
          setFloatingTexts(prev => prev.filter(t => t.id !== id));
      }, 900);
  };

  const handleSelectOption = (optionId: string, e: React.MouseEvent<HTMLButtonElement>) => {
    if (isAnswered) return;
    
    // Get click coordinates relative to viewport
    const burstX = e.clientX; 
    const burstY = e.clientY;

    const isCorrect = optionId === currentQuestion.correctAnswer;
    
    playFeedbackSound(isCorrect);
    setSelectedAnswer(optionId);
    setIsAnswered(true);

    const newStreak = isCorrect ? streak + 1 : 0;

    createBurst(burstX, burstY, isCorrect);
    createFloatingText(burstX, burstY, isCorrect, newStreak);

    if (isCorrect) {
      setScore(s => s + 1);
      setStreak(newStreak); 
      setAvatarState('happy');
    } else {
      setShake(true);
      setStreak(0); 
      setAvatarState('sad');
      setWrongQuestions(prev => [...prev, currentQuestion]);
      setTimeout(() => setShake(false), 500); 
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
      setAvatarState('neutral');
      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      onComplete(score, questions.length, wrongQuestions);
    }
  };

  // Helper to determine layout class based on image presence
  // Optional chaining just in case, though guard clause above handles main undefined case
  const hasImageOptions = currentQuestion.options?.some(opt => opt.image);

  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden overflow-y-auto bg-gradient-to-br from-[#2a0a18] via-[#4a0418] to-[#2a0a18]">
        {/* SVG Defs for Arrowheads - Critical for Chemistry drawings */}
        <svg width="0" height="0" className="absolute pointer-events-none">
            <defs>
                <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="black" />
                </marker>
            </defs>
        </svg>

        {/* Zoom Modal */}
        {zoomedImage && (
          <div 
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
            onClick={() => setZoomedImage(null)}
          >
            <div className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl p-2 md:p-4 overflow-hidden shadow-2xl flex items-center justify-center animate-pop" onClick={e => e.stopPropagation()}>
              <button 
                onClick={() => setZoomedImage(null)}
                className="absolute top-2 right-2 md:top-4 md:right-4 bg-gray-200/50 hover:bg-gray-200 text-black rounded-full p-2 transition-colors z-10"
              >
                <X size={24} />
              </button>
              <div 
                className="w-full h-full flex items-center justify-center [&>svg]:w-full [&>svg]:h-auto [&>svg]:max-h-[85vh] [&>svg]:object-contain" 
                dangerouslySetInnerHTML={{ __html: zoomedImage }}
              />
            </div>
          </div>
        )}

        {/* Animated Background Mesh */}
        <div className="fixed inset-0 opacity-20 pointer-events-none">
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-pink-600 blur-[120px] animate-pulse"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-rose-600 blur-[120px] animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        {/* Global FX Layer */}
        <div className="fixed inset-0 pointer-events-none z-50">
            {burstParticles.map(p => (
                <div 
                    key={p.id}
                    className="absolute animate-burst"
                    style={{
                        left: p.x - p.size / 2, 
                        top: p.y - p.size / 2,
                        color: p.color,
                        width: p.size,
                        height: p.size,
                        '--tw-translate-x': `${p.tx}px`,
                        '--tw-translate-y': `${p.ty}px`,
                        '--tw-rotate': `${p.r}deg`,
                    } as React.CSSProperties}
                >
                    <p.Icon size="100%" fill="currentColor" />
                </div>
            ))}
            {floatingTexts.map(t => (
                <div
                    key={t.id}
                    className={`absolute font-bold text-xl whitespace-nowrap animate-float-up-fade ${t.color}`}
                    style={{ 
                        left: t.x, 
                        top: t.y - 40, 
                        '--tw-rotate': `${t.rotation}deg`,
                        transform: `translate(-50%) rotate(${t.rotation}deg) scale(${t.scale})`,
                        textShadow: '0 4px 15px rgba(0,0,0,0.5)' 
                    } as React.CSSProperties}
                >
                    {t.text}
                </div>
            ))}
        </div>

        {/* Header Bar */}
        <div className="sticky top-0 z-40 bg-black/10 backdrop-blur-lg border-b border-white/5">
            <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
                <button 
                    onClick={onBack}
                    className="flex items-center gap-2 text-white/70 hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-full"
                >
                    <Home size={18} />
                    <span className="font-medium text-sm hidden sm:inline">Trang chủ</span>
                </button>
                
                {/* Center: Progress & Avatar */}
                <div className="flex items-center gap-4">
                     {/* Streak Counter */}
                    <div 
                        key={streak}
                        className={`hidden sm:flex items-center gap-2 bg-black/20 px-3 py-1 rounded-full transition-all duration-300 ${streak > 2 ? 'opacity-100 scale-100 animate-pop' : 'opacity-0 scale-90'}`}
                    >
                        <Flame size={16} className="text-orange-500 animate-pulse-fast" fill="currentColor" />
                        <span className="text-orange-400 font-bold font-handwriting">x{streak}</span>
                    </div>

                    <div className="flex flex-col items-center">
                        <div className={`
                            w-10 h-10 rounded-full flex items-center justify-center border shadow-lg transition-all duration-300
                            ${avatarState === 'happy' ? 'bg-gradient-to-br from-pink-500 to-rose-500 border-white scale-110' : 
                              avatarState === 'sad' ? 'bg-gray-700 border-gray-500' : 'bg-white/10 border-white/20'}
                        `}>
                            {avatarState === 'happy' ? <Smile size={20} className="text-white" /> :
                             avatarState === 'sad' ? <Frown size={20} className="text-gray-300" /> :
                             <Sparkles size={18} className="text-pink-200" />}
                        </div>
                    </div>
                </div>

                <div className="text-white/80 font-medium font-mono bg-white/5 px-3 py-1.5 rounded-full text-sm">
                    {currentIndex + 1}<span className="text-white/40">/</span>{questions.length}
                </div>
            </div>

             {/* Liquid Progress Bar */}
             <div className="w-full h-1.5 bg-white/5 overflow-hidden">
                <div 
                    className="h-full bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 transition-all duration-500 ease-out shadow-[0_0_10px_rgba(236,72,153,0.5)]"
                    style={{ width: `${progress}%` }}
                ></div>
            </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 w-full max-w-6xl mx-auto p-4 md:p-6 lg:p-8 flex flex-col items-center">
            
            {/* Question Card */}
            <div className={`
                w-full bg-black/20 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-10 shadow-2xl mb-8 transition-transform duration-500
                ${shake ? 'animate-shake border-red-500/30 bg-red-900/10' : ''}
            `}>
                <div className="flex items-start gap-4 mb-6">
                    <div className="bg-pink-500/20 p-2.5 rounded-2xl hidden md:block">
                        <HelpCircle className="text-pink-400" size={28} />
                    </div>
                    <div className="flex-1">
                        {/* Render Text as HTML to support Subscripts */}
                        <h2 
                            className="text-xl md:text-2xl font-bold text-white/95 leading-relaxed tracking-wide"
                            dangerouslySetInnerHTML={{ __html: currentQuestion.text }}
                        >
                        </h2>
                    </div>
                </div>
                
                {currentQuestion.imageEquation && (
                    <div 
                        className="bg-white rounded-2xl p-4 md:p-6 mb-8 text-black flex items-center justify-center shadow-[inset_0_2px_10px_rgba(0,0,0,0.1)] overflow-hidden border-4 border-white/50 cursor-zoom-in group relative w-full min-h-[150px] h-auto"
                        onClick={() => setZoomedImage(currentQuestion.imageEquation || null)}
                    >
                         {/* UPDATED: Removed constraints on svg height, let the container expand to fit content */}
                        <div className="w-full flex items-center justify-center [&>svg]:w-full [&>svg]:h-auto [&>svg]:max-h-[60vh]" dangerouslySetInnerHTML={{ __html: currentQuestion.imageEquation }} />
                        <div className="absolute top-3 right-3 bg-gray-100/80 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                            <ZoomIn size={20} className="text-gray-600" />
                        </div>
                    </div>
                )}

                {/* Options Grid - Modern Cards */}
                <div className={`grid ${hasImageOptions ? 'grid-cols-1 md:grid-cols-2 gap-6' : 'grid-cols-1 gap-4'}`}>
                    {currentQuestion.options.map((option) => {
                        const isSelected = selectedAnswer === option.id;
                        const isCorrect = option.id === currentQuestion.correctAnswer;
                        const showResult = isAnswered;

                        // Modern Card Styling Logic
                        let wrapperClass = "bg-white/5 border-white/10 hover:bg-white/10 hover:border-pink-500/30"; // Default
                        let badgeClass = "bg-white/10 text-white/60 group-hover:bg-pink-500 group-hover:text-white";
                        let statusIcon = null;

                        if (showResult) {
                            if (isSelected && isCorrect) {
                                wrapperClass = "bg-green-500/10 border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.2)]";
                                badgeClass = "bg-green-500 text-white";
                                statusIcon = <CheckCircle2 className="text-green-500 drop-shadow-md" size={28} fill="white" />;
                            } else if (isSelected && !isCorrect) {
                                wrapperClass = "bg-red-500/10 border-red-500";
                                badgeClass = "bg-red-500 text-white";
                                statusIcon = <XCircle className="text-red-500 drop-shadow-md" size={28} fill="white" />;
                            } else if (!isSelected && isCorrect) {
                                wrapperClass = "bg-green-500/5 border-green-500/50 opacity-80 border-dashed";
                                badgeClass = "bg-green-500/50 text-white";
                            } else {
                                wrapperClass = "opacity-40 grayscale";
                            }
                        } else if (isSelected) {
                            wrapperClass = "bg-pink-500/20 border-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.3)]";
                            badgeClass = "bg-pink-500 text-white";
                        }

                        const isImageOption = !!option.image;

                        return (
                            <button
                                key={option.id}
                                disabled={isAnswered}
                                onClick={(e) => handleSelectOption(option.id, e)}
                                className={`
                                    relative group rounded-2xl border-2 transition-all duration-200 text-left overflow-hidden flex flex-col
                                    ${wrapperClass}
                                    ${!isAnswered ? 'hover:scale-[1.01] active:scale-[0.99]' : ''}
                                `}
                            >
                                {/* Header of Option Card */}
                                <div className="flex items-center justify-between p-4 pb-2 w-full">
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm transition-colors duration-300 ${badgeClass}`}>
                                        {option.id}
                                    </div>
                                    {statusIcon}
                                </div>

                                {/* Content of Option Card */}
                                <div className={`p-4 pt-0 w-full ${isImageOption ? 'flex-1 flex flex-col' : ''}`}>
                                  {option.image ? (
                                    // Image Container: Clean White Background
                                    // UPDATED: Adjusted height to ensure visibility and prevent collapse
                                    <div 
                                        className="w-full bg-white rounded-xl p-4 flex items-center justify-center overflow-hidden min-h-[120px] h-auto shadow-inner relative group/image cursor-zoom-in"
                                        onClick={(e) => {
                                            if (isAnswered) { // Only allow zoom if not clicking to select answer (or use icon)
                                                e.stopPropagation();
                                                setZoomedImage(option.image!);
                                            }
                                        }}
                                    >
                                        <div 
                                          className="w-full h-full flex items-center justify-center [&>svg]:max-w-[95%] [&>svg]:max-h-[95%] [&>svg]:w-auto [&>svg]:h-auto" 
                                          dangerouslySetInnerHTML={{ __html: option.image }} 
                                        />
                                        {/* Zoom Icon Hint */}
                                        <div 
                                            className="absolute bottom-2 right-2 text-black/20 hover:text-pink-500 transition-colors cursor-pointer p-1"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setZoomedImage(option.image!);
                                            }}
                                        >
                                            <ZoomIn size={20} />
                                        </div>
                                    </div>
                                  ) : (
                                    <span 
                                        className={`text-lg font-medium transition-colors ${isSelected || (showResult && isCorrect) ? 'text-white' : 'text-gray-200'}`}
                                        dangerouslySetInnerHTML={{ __html: option.text }}
                                    >
                                    </span>
                                  )}
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

             {/* Explanation Card */}
             {isAnswered && (
                <div className="w-full animate-slide-up mb-24">
                    <div className={`
                        rounded-2xl p-6 border backdrop-blur-md relative overflow-hidden
                        ${avatarState === 'happy' 
                            ? 'bg-green-900/20 border-green-500/30' 
                            : 'bg-pink-900/20 border-pink-500/30'}
                    `}>
                         <div className="absolute top-0 right-0 p-4 opacity-10">
                            {avatarState === 'happy' ? <Heart size={100} /> : <BookX size={100} />}
                        </div>

                        <div className="flex items-start gap-3 relative z-10">
                            <div className={`p-2 rounded-xl ${avatarState === 'happy' ? 'bg-green-500/20 text-green-400' : 'bg-pink-500/20 text-pink-400'}`}>
                                <Lightbulb size={24} />
                            </div>
                            <div>
                                <h3 className={`font-handwriting text-xl mb-2 font-bold ${avatarState === 'happy' ? 'text-green-300' : 'text-pink-300'}`}>
                                    {avatarState === 'happy' ? "Chính xác rồi nàng ơi! 💖" : "Đừng lo, xem lời giải nè: 🌟"}
                                </h3>
                                <p 
                                    className="text-gray-200 text-lg leading-relaxed"
                                    dangerouslySetInnerHTML={{ __html: currentQuestion.explanation || "Hãy ghi nhớ kiến thức quan trọng này nhé! Anh tin em sẽ làm tốt hơn ở lần sau ❤️" }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>

        {/* Bottom Floating Action Bar */}
        <div className="fixed bottom-0 left-0 w-full p-4 bg-gradient-to-t from-[#2a0a18] to-transparent z-50 flex justify-center pointer-events-none">
            <button
                onClick={handleNext}
                disabled={!isAnswered}
                className={`
                    pointer-events-auto shadow-2xl flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-white text-lg transition-all duration-300
                    ${isAnswered 
                        ? 'bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 hover:-translate-y-1 shadow-pink-500/40 w-full sm:w-auto sm:min-w-[200px] justify-center' 
                        : 'bg-white/5 text-white/20 border border-white/5 cursor-not-allowed opacity-0 translate-y-10'}
                `}
            >
                {currentIndex === questions.length - 1 ? 'Hoàn thành' : 'Câu tiếp theo'}
                <ChevronRight size={24} />
            </button>
        </div>
    </div>
  );
};

export default QuizScreen;
