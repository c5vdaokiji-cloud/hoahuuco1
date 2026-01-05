import React, { useState, useMemo } from 'react';
import HomeScreen from './components/HomeScreen';
import QuizScreen from './components/QuizScreen';
import FloatingParticles from './components/FloatingParticles';
import HeartConfetti from './components/HeartConfetti';
import BackgroundMusic from './components/BackgroundMusic';
import { ScreenState, Question } from './types';
import { QUESTIONS_MAP } from './constants';
import { RefreshCcw, Heart, MessageCircleHeart, BookX } from 'lucide-react';

const App: React.FC = () => {
  const [screen, setScreen] = useState<ScreenState>('HOME');
  // Default to deck 4 as IDs start from 4 in constants.ts
  const [selectedDeckId, setSelectedDeckId] = useState<number>(4);
  const [finalScore, setFinalScore] = useState<{score: number, total: number} | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  
  // State to hold wrong questions for review mode
  const [wrongAnswers, setWrongAnswers] = useState<Question[]>([]);
  // State to hold custom questions (e.g., for review mode or custom selection)
  const [customQuizQuestions, setCustomQuizQuestions] = useState<Question[] | null>(null);

  const handleStartQuiz = (specificQuestions?: Question[]) => {
    setShowConfetti(true);
    
    if (specificQuestions && specificQuestions.length > 0) {
        setCustomQuizQuestions(specificQuestions);
    } else {
        setCustomQuizQuestions(null); // Reset to use deck questions
    }
    
    // Delay switching screens to let confetti fall a bit
    setTimeout(() => {
      setScreen('QUIZ');
      // Turn off confetti generator after transition
      setTimeout(() => setShowConfetti(false), 2000);
    }, 1200);
  };

  const handleReviewMistakes = () => {
    if (wrongAnswers.length === 0) return;
    
    setCustomQuizQuestions(wrongAnswers);
    setScreen('QUIZ');
  };

  const handleQuizComplete = (score: number, total: number, wrongQs: Question[]) => {
    setFinalScore({ score, total });
    setWrongAnswers(wrongQs);
    setScreen('RESULT');
    
    // Trigger confetti if score is high (>= 80%)
    if (total > 0 && (score / total) >= 0.8) {
      setTimeout(() => {
        setShowConfetti(true);
        // Turn off after 5 seconds
        setTimeout(() => setShowConfetti(false), 5000);
      }, 500); // Small delay to sync with screen transition
    }
  };

  const handleBackToHome = () => {
    setScreen('HOME');
    setFinalScore(null);
    setShowConfetti(false); // Ensure confetti is off
    setCustomQuizQuestions(null);
    setWrongAnswers([]);
  };

  // Result Screen Component inline for simplicity in App structure
  const ResultScreen = () => {
    const percentage = finalScore ? finalScore.score / finalScore.total : 0;
    const isHighScore = percentage >= 0.8;

    // Messages Logic
    const message = useMemo(() => {
      const highMessages = [
        "Em giỏi quá! Anh tự hào về em lắm ❤️",
        "Thông minh, xinh đẹp, lại còn giỏi Hóa nữa. Em là số 1! 🥰",
        "10 điểm cho nhan sắc, 10 điểm cho trí tuệ. Yêu em! 🌹",
        "Đỉnh cao quá nàng ơi! Tặng em ngàn nụ hôn 💋",
        "Xuất sắc! Phần thưởng là một cái ôm thật chặt nhé 🤗",
        "Trí tuệ của em làm anh say đắm hơn cả rượu vang 🍷",
        "Nàng của anh đúng là thiên tài mà! 😍"
      ];

      const lowMessages = [
        "Không sao đâu, mình làm lại lần nữa nhé! Anh luôn ủng hộ em 💪",
        "Cố lên nàng ơi, kiến thức ngấm dần mà. Yêu em! ❤️",
        "Dù kết quả thế nào thì em vẫn là giỏi nhất trong lòng anh 🥰",
        "Sai một chút để nhớ lâu hơn thôi. Cố lên nhé công chúa của anh 👑",
        "Đừng buồn nhé, anh sẽ ngồi học cùng em mà! 📚",
        "Thất bại là mẹ thành công, còn em là mẹ của... các con anh (sau này) 😳 Cố lên!",
        "Chỉ là xui xẻo chút thôi, lần sau em sẽ làm tốt hơn mà! 🍀"
      ];

      const list = isHighScore ? highMessages : lowMessages;
      return list[Math.floor(Math.random() * list.length)];
    }, [isHighScore]);

    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 relative">
         <div className="absolute top-0 left-0 w-full h-full bg-[size:40px_40px] bg-grid-pattern opacity-20 pointer-events-none"></div>
         
         <div className="bg-brand-dark/40 border border-pink-500/30 backdrop-blur-xl rounded-3xl p-10 max-w-md w-full text-center shadow-2xl animate-fade-in-up z-10 relative overflow-hidden">
            
            {/* Spotlight effect behind the icon */}
            <div className="absolute top-10 left-1/2 -translate-x-1/2 w-32 h-32 bg-pink-500/20 rounded-full blur-3xl -z-10"></div>

            <div className={`w-24 h-24 bg-gradient-to-br ${isHighScore ? 'from-pink-500 to-rose-600' : 'from-gray-600 to-gray-700'} rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-pink-500/20`}>
              {isHighScore ? (
                <Heart size={48} fill="white" className="text-white animate-pulse" />
              ) : (
                <MessageCircleHeart size={48} className="text-white" />
              )}
            </div>
            
            <h2 className="text-4xl font-bold text-white mb-2 font-handwriting">Kết quả của nàng</h2>
            
            {/* Romantic Message Area */}
            <div className="min-h-[60px] flex items-center justify-center mb-6">
              <p className="text-pink-200 text-2xl italic font-medium leading-relaxed font-handwriting">
                "{message}"
              </p>
            </div>

            <div className="bg-white/5 rounded-2xl p-6 mb-8 border border-white/5">
               <div className="text-gray-400 text-sm mb-1">Điểm số</div>
               <div className="text-5xl font-bold text-white">
                  {finalScore?.score}<span className="text-2xl text-gray-500">/{finalScore?.total}</span>
               </div>
               <div className={`mt-2 text-sm font-medium ${isHighScore ? 'text-green-400' : 'text-yellow-400'}`}>
                  {isHighScore ? 'Xuất sắc (A+)' : 'Hoàn thành'}
               </div>
            </div>

            <div className="flex flex-col gap-3">
               <div className="flex gap-4">
                  <button 
                    onClick={handleBackToHome}
                    className="flex-1 bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
                  >
                    Trang chủ
                  </button>
                  <button 
                    onClick={() => {
                      setScreen('HOME');
                      // Reset logic for replay is simple here
                      setTimeout(() => handleStartQuiz(), 100);
                    }}
                    className="flex-1 bg-pink-600 hover:bg-pink-500 text-white font-semibold py-3 px-6 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg shadow-pink-600/30"
                  >
                    <RefreshCcw size={18} />
                    Làm lại
                  </button>
               </div>
               
               {/* Review Mistakes Button */}
               {wrongAnswers.length > 0 && (
                 <button
                   onClick={handleReviewMistakes}
                   className="w-full bg-orange-500/80 hover:bg-orange-500 text-white font-semibold py-3 px-6 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg hover:shadow-orange-500/30 border border-orange-400/30"
                 >
                   <BookX size={18} />
                   Ôn lại {wrongAnswers.length} câu sai
                 </button>
               )}
            </div>
         </div>
      </div>
    );
  };

  return (
    <div className="font-sans antialiased text-white min-h-screen selection:bg-pink-500 selection:text-white relative bg-transparent">
      {/* Background Music Player */}
      <BackgroundMusic />

      {/* Background Particles Layer */}
      <FloatingParticles />
      
      {/* Confetti Layer */}
      <HeartConfetti active={showConfetti} />

      <div className="relative z-10">
        {screen === 'HOME' && (
          <HomeScreen 
            selectedDeckId={selectedDeckId} 
            onSelectDeck={setSelectedDeckId} 
            onStartQuiz={handleStartQuiz} 
          />
        )}
        
        {screen === 'QUIZ' && (
          <QuizScreen 
            questions={customQuizQuestions || QUESTIONS_MAP[selectedDeckId] || []} 
            onBack={handleBackToHome}
            onComplete={handleQuizComplete}
          />
        )}

        {screen === 'RESULT' && <ResultScreen />}
      </div>
    </div>
  );
};

export default App;