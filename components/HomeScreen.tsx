import React, { useState, useEffect } from 'react';
import { BookOpen, Heart, Shuffle, Trophy, Book, Star, Atom, ListFilter, X, CheckSquare, Square, CheckCircle2 } from 'lucide-react';
import { Deck, Question } from '../types';
import { DECKS, QUESTIONS_MAP } from '../constants';

interface HomeScreenProps {
  selectedDeckId: number;
  onSelectDeck: (id: number) => void;
  onStartQuiz: (questions?: Question[]) => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ selectedDeckId, onSelectDeck, onStartQuiz }) => {
  const [isQuestionSelectorOpen, setIsQuestionSelectorOpen] = useState(false);
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<number[]>([]);

  // Get questions for current deck
  const currentDeckQuestions = QUESTIONS_MAP[selectedDeckId] || [];

  // Reset selection when deck changes
  useEffect(() => {
    setSelectedQuestionIds([]);
  }, [selectedDeckId]);

  const handleOpenSelector = () => {
    // If empty, select all by default
    if (selectedQuestionIds.length === 0) {
      setSelectedQuestionIds(currentDeckQuestions.map(q => q.id));
    }
    setIsQuestionSelectorOpen(true);
  };

  const toggleQuestion = (id: number) => {
    setSelectedQuestionIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(qId => qId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const toggleAll = () => {
    if (selectedQuestionIds.length === currentDeckQuestions.length) {
      setSelectedQuestionIds([]);
    } else {
      setSelectedQuestionIds(currentDeckQuestions.map(q => q.id));
    }
  };

  const handleStartCustomQuiz = () => {
    const selectedQuestions = currentDeckQuestions.filter(q => selectedQuestionIds.includes(q.id));
    // Sort by ID to maintain order
    selectedQuestions.sort((a, b) => a.id - b.id);
    onStartQuiz(selectedQuestions);
    setIsQuestionSelectorOpen(false);
  };

  const handleShuffleStart = () => {
      // Create a shuffled copy of the questions
      const shuffled = [...currentDeckQuestions].sort(() => Math.random() - 0.5);
      onStartQuiz(shuffled);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full bg-[size:40px_40px] bg-grid-pattern opacity-20 pointer-events-none"></div>
      
      {/* Floating background icons */}
      <div className="absolute top-20 right-[10%] text-white/5 pointer-events-none animate-pulse">
        <Heart size={180} fill="currentColor" />
      </div>
      <div className="absolute bottom-32 left-[5%] text-white/5 pointer-events-none animate-bounce" style={{ animationDuration: '3s' }}>
        <Atom size={120} />
      </div>

      {/* Header Tag */}
      <div className="relative z-10 inline-flex items-center gap-2 bg-white/10 px-5 py-2 rounded-full backdrop-blur-md border border-white/20 mb-8 animate-fade-in-down shadow-lg shadow-pink-500/10">
        <Heart className="text-pink-400 fill-pink-400" size={16} />
        <span className="text-lg font-medium text-pink-100 tracking-wide font-handwriting">Ôn tập Hóa Hữu Cơ cùng nàng</span>
        <Heart className="text-pink-400 fill-pink-400" size={16} />
      </div>

      {/* Main Title */}
      <h1 className="relative z-10 text-5xl md:text-7xl font-bold text-white mb-2 text-center tracking-tight drop-shadow-xl">
        Nàng Của Anh
      </h1>
      <div className="relative z-10 text-xl md:text-2xl text-pink-200/80 font-light tracking-widest uppercase mb-6">
        Chemistry Quiz
      </div>
      
      {/* Emoji Face Interaction */}
      <div className="relative z-10 text-7xl mb-8 group cursor-pointer transition-transform hover:scale-110 duration-300">
        <span className="drop-shadow-2xl">🥰</span>
        <div className="absolute -top-4 -right-6 text-4xl opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">❤️</div>
        <div className="absolute -bottom-2 -left-6 text-4xl opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100 translate-y-4 group-hover:translate-y-0">✨</div>
      </div>

      {/* Subtitle */}
      <p className="relative z-10 text-gray-300 text-center max-w-lg mb-10 text-lg leading-relaxed font-light">
        Mỗi câu hỏi là một bước gần hơn đến điểm 10.<br/>
        <strong className="text-white font-medium font-handwriting text-2xl mt-2 block">Chọn đề thi bên dưới để bắt đầu nhé!</strong>
      </p>

      {/* Deck Selection Grid */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-3xl mb-10 px-2">
        {DECKS.map((deck) => {
          const isSelected = selectedDeckId === deck.id;
          return (
            <button
              key={deck.id}
              onClick={() => onSelectDeck(deck.id)}
              className={`
                relative group overflow-hidden rounded-3xl p-5 text-left transition-all duration-300 border-2
                hover:shadow-xl active:scale-[0.98]
                ${isSelected 
                  ? 'bg-gradient-to-br from-pink-600 to-rose-600 border-pink-400 shadow-[0_0_30px_rgba(225,29,72,0.4)] scale-[1.02] z-10' 
                  : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/30 hover:shadow-lg shadow-black/20'}
              `}
            >
              {/* Card Glow Effect */}
              {isSelected && <div className="absolute inset-0 bg-white/10 mix-blend-overlay pointer-events-none"></div>}
              
              <div className="flex items-start justify-between mb-3">
                <div className={`p-3 rounded-2xl ${isSelected ? 'bg-white/20' : 'bg-white/5'}`}>
                  <BookOpen size={24} className={isSelected ? 'text-white' : 'text-gray-400 group-hover:text-pink-300 transition-colors'} />
                </div>
                {isSelected && (
                   <div className="bg-white text-pink-600 p-1.5 rounded-full shadow-sm animate-bounce">
                     <Heart size={14} fill="currentColor" />
                   </div>
                )}
              </div>
              
              <div>
                <h3 className={`text-xl font-bold mb-1 ${isSelected ? 'text-white' : 'text-gray-200 group-hover:text-white transition-colors'}`}>
                  {deck.name}
                </h3>
                <div className="flex items-center gap-2">
                  <span className={`text-sm ${isSelected ? 'text-pink-100' : 'text-gray-500 group-hover:text-gray-300'}`}>
                    {deck.totalQuestions} câu hỏi
                  </span>
                  {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-pink-200"></span>}
                  {isSelected && <span className="text-xs text-pink-200 font-medium">Đã chọn</span>}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div className="relative z-10 flex flex-col sm:flex-row gap-4 mb-16 w-full max-w-xl px-4">
        <button 
          onClick={() => onStartQuiz()}
          className="group flex-[2] relative overflow-hidden bg-gradient-to-r from-pink-500 to-rose-600 text-white font-bold py-4 px-8 rounded-2xl shadow-lg hover:shadow-pink-500/40 transform hover:-translate-y-1 active:translate-y-0 transition-all duration-300"
        >
          <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer" />
          <div className="flex items-center justify-center gap-3">
            <Heart fill="currentColor" size={20} className="group-hover:scale-110 transition-transform" />
            <span>Làm Bài Ngay</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </div>
        </button>
        
        <div className="flex flex-1 gap-2">
            <button 
                onClick={handleOpenSelector}
                title="Chọn câu hỏi"
                className="flex-1 bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 hover:border-pink-500/30 font-semibold py-4 px-4 rounded-2xl transition-all duration-300 flex items-center justify-center group active:scale-95"
            >
                <ListFilter size={20} className="group-hover:text-pink-400 transition-colors" />
            </button>
            <button 
                onClick={handleShuffleStart}
                title="Xáo trộn đề"
                className="flex-1 bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 hover:border-pink-500/30 font-semibold py-4 px-4 rounded-2xl transition-all duration-300 flex items-center justify-center group active:scale-95"
            >
                <Shuffle size={20} className="group-hover:rotate-180 transition-transform duration-500" />
            </button>
        </div>
      </div>

      {/* Stats Footer */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl px-4">
        <StatCard 
          icon={<Book className="text-white" size={24} />} 
          value="3" 
          label="Bộ đề chọn lọc" 
          color="bg-gradient-to-br from-pink-500 to-pink-600" 
        />
        <StatCard 
          icon={<Star className="text-white" size={24} />} 
          value="100%" 
          label="Kiến thức chuẩn" 
          color="bg-gradient-to-br from-orange-400 to-orange-500" 
        />
        <StatCard 
          icon={<Trophy className="text-white" size={24} />} 
          value="A+" 
          label="Mục tiêu điểm cao" 
          color="bg-gradient-to-br from-rose-500 to-red-600" 
        />
      </div>

      {/* Question Selector Modal */}
      {isQuestionSelectorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-brand-card w-full max-w-2xl max-h-[85vh] rounded-3xl border border-white/10 shadow-2xl flex flex-col animate-pop overflow-hidden">
            {/* Modal Header */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between bg-brand-dark/50">
              <div>
                <h3 className="text-2xl font-bold text-white">Chọn câu hỏi</h3>
                <p className="text-gray-400 text-sm mt-1">Đề: {DECKS.find(d => d.id === selectedDeckId)?.name}</p>
              </div>
              <button 
                onClick={() => setIsQuestionSelectorOpen(false)}
                className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Selection Controls */}
            <div className="px-6 py-3 border-b border-white/10 bg-white/5 flex items-center justify-between">
                <button 
                    onClick={toggleAll}
                    className="flex items-center gap-2 text-sm font-medium text-pink-300 hover:text-pink-200 transition-colors"
                >
                    {selectedQuestionIds.length === currentDeckQuestions.length ? (
                        <><CheckCircle2 size={18} /> Bỏ chọn tất cả</>
                    ) : (
                        <><CheckSquare size={18} /> Chọn tất cả</>
                    )}
                </button>
                <span className="text-sm text-gray-400">
                    Đã chọn: <span className="text-white font-bold">{selectedQuestionIds.length}</span>/{currentDeckQuestions.length}
                </span>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                <div className="grid grid-cols-1 gap-2">
                    {currentDeckQuestions.map(q => {
                        const isChecked = selectedQuestionIds.includes(q.id);
                        return (
                            <div 
                                key={q.id}
                                onClick={() => toggleQuestion(q.id)}
                                className={`
                                    flex items-center gap-4 p-4 rounded-xl cursor-pointer border transition-all duration-200
                                    ${isChecked 
                                        ? 'bg-pink-600/20 border-pink-500/50 hover:bg-pink-600/30' 
                                        : 'bg-white/5 border-transparent hover:bg-white/10'}
                                `}
                            >
                                <div className={`text-pink-400 ${isChecked ? 'text-pink-500' : 'text-gray-500'}`}>
                                    {isChecked ? <CheckSquare size={24} fill="currentColor" className="text-white" /> : <Square size={24} />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-baseline gap-2 mb-1">
                                        <span className={`font-mono text-sm px-2 py-0.5 rounded ${isChecked ? 'bg-pink-500 text-white' : 'bg-white/10 text-gray-400'}`}>
                                            Câu {q.id}
                                        </span>
                                    </div>
                                    <p className={`text-sm truncate ${isChecked ? 'text-white' : 'text-gray-400'}`} dangerouslySetInnerHTML={{ __html: q.text }}></p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-white/10 bg-brand-dark/50 flex justify-end gap-3">
                <button 
                    onClick={() => setIsQuestionSelectorOpen(false)}
                    className="px-6 py-3 rounded-xl font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                >
                    Hủy
                </button>
                <button 
                    onClick={handleStartCustomQuiz}
                    disabled={selectedQuestionIds.length === 0}
                    className={`
                        px-8 py-3 rounded-xl font-bold text-white shadow-lg flex items-center gap-2 transition-all
                        ${selectedQuestionIds.length > 0 
                            ? 'bg-gradient-to-r from-pink-600 to-rose-600 hover:scale-105' 
                            : 'bg-gray-700 cursor-not-allowed opacity-50'}
                    `}
                >
                    <Heart size={18} fill="currentColor" />
                    Bắt đầu ({selectedQuestionIds.length})
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ icon, value, label, color }: { icon: React.ReactNode, value: string, label: string, color: string }) => (
  <div className="bg-brand-dark/30 border border-white/5 rounded-3xl p-6 backdrop-blur-md hover:bg-brand-dark/50 transition-colors group">
    <div className="flex items-center gap-4">
      <div className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
        {icon}
      </div>
      <div>
        <div className="text-2xl font-bold text-white mb-0.5">{value}</div>
        <div className="text-gray-400 text-sm font-medium">{label}</div>
      </div>
    </div>
  </div>
);

export default HomeScreen;