import React, { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';

interface HeartConfettiProps {
  active: boolean;
}

interface ConfettiParticle {
  id: number;
  left: number;
  duration: number;
  delay: number;
  color: string;
  size: number;
  rotation: number;
}

const HeartConfetti: React.FC<HeartConfettiProps> = ({ active }) => {
  const [particles, setParticles] = useState<ConfettiParticle[]>([]);

  useEffect(() => {
    if (active) {
      // Create a burst of particles
      const count = 60;
      const newParticles: ConfettiParticle[] = [];
      const colors = ['text-pink-400', 'text-rose-500', 'text-red-500', 'text-white', 'text-pink-300'];

      for (let i = 0; i < count; i++) {
        newParticles.push({
          id: i,
          left: Math.random() * 100, // random horizontal start
          duration: Math.random() * 1.5 + 1.5, // 1.5s to 3s fall time
          delay: Math.random() * 0.5, // stagger start slightly
          color: colors[Math.floor(Math.random() * colors.length)],
          size: Math.random() * 24 + 12, // 12px to 36px
          rotation: Math.random() * 360
        });
      }
      setParticles(newParticles);
    } else {
      // Clear particles when not active (or keep them until they finish? 
      // Simpler to clear if screen changes or wait for unmount)
      const timer = setTimeout(() => setParticles([]), 3000); 
      return () => clearTimeout(timer);
    }
  }, [active]);

  if (!active && particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className={`absolute -top-10 ${p.color}`}
          style={{
            left: `${p.left}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            animation: `confetti-fall ${p.duration}s ease-in forwards`,
            animationDelay: `${p.delay}s`,
            transform: `rotate(${p.rotation}deg)`
          }}
        >
          <Heart size="100%" fill="currentColor" />
        </div>
      ))}
    </div>
  );
};

export default HeartConfetti;