import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Music } from 'lucide-react';

const BackgroundMusic: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Using a nice romantic piano track from a stable source (Pixabay/Cdn)
  // "Romantic Inspiration" or similar style
  const MUSIC_URL = "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=piano-moment-111783.mp3";

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = 0.3; // Low volume background
      
      // Try to play immediately
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
           // Autoplay blocked. We add a document click listener to start it once.
           const unlockAudio = () => {
             audio.play().catch(e => console.error(e));
             document.removeEventListener('click', unlockAudio);
             document.removeEventListener('touchstart', unlockAudio);
           };
           document.addEventListener('click', unlockAudio);
           document.addEventListener('touchstart', unlockAudio);
        });
      }
    }
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      audio.play();
    } else {
      audio.pause();
    }
  };

  return (
    <div className="fixed top-4 left-4 z-50">
      <audio 
        ref={audioRef} 
        loop 
        preload="auto"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      >
        <source src={MUSIC_URL} type="audio/mpeg" />
      </audio>
      <button
        onClick={togglePlay}
        className={`
          flex items-center gap-2 px-3 py-2 rounded-full backdrop-blur-md border transition-all duration-300
          ${isPlaying 
            ? 'bg-pink-500/20 border-pink-400/50 text-pink-200 shadow-[0_0_15px_rgba(236,72,153,0.3)]' 
            : 'bg-black/30 border-white/10 text-gray-400 hover:bg-black/50 animate-pulse'}
        `}
      >
        {isPlaying ? (
          <>
            <div className="flex gap-1 items-end h-4">
               <span className="w-1 bg-pink-300 h-2 animate-[bounce_1s_infinite]"></span>
               <span className="w-1 bg-pink-300 h-4 animate-[bounce_1.2s_infinite]"></span>
               <span className="w-1 bg-pink-300 h-3 animate-[bounce_0.8s_infinite]"></span>
            </div>
            <span className="text-xs font-medium hidden md:block ml-1">Nhạc nền</span>
          </>
        ) : (
          <>
            <VolumeX size={18} />
            <span className="text-xs font-medium hidden md:block">Bật nhạc lên nè!</span>
          </>
        )}
      </button>
    </div>
  );
};

export default BackgroundMusic;