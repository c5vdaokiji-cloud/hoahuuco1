import React, { useEffect, useState } from 'react';
import { Heart, Snowflake, Atom, FlaskConical, Hexagon, Zap, Beaker, Star } from 'lucide-react';

const ICONS = [Heart, Snowflake, Atom, FlaskConical, Hexagon, Zap, Beaker, Star];

interface Particle {
  id: number;
  Icon: React.ElementType;
  style: React.CSSProperties;
  className: string;
}

const FloatingParticles: React.FC = () => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    // Increased particle count for a richer effect
    const particleCount = 35;
    const newParticles: Particle[] = [];

    const colors = [
      'text-pink-400',
      'text-pink-300',
      'text-rose-400',
      'text-white',
      'text-purple-300',
      'text-orange-200'
    ];

    for (let i = 0; i < particleCount; i++) {
      const isWander = Math.random() > 0.6; // 40% float up, 60% wander/drift (keep more on screen)
      const Icon = ICONS[Math.floor(Math.random() * ICONS.length)];
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      // Varied sizes, slightly larger average
      const size = Math.floor(Math.random() * 24) + 10; 
      const opacity = Math.random() * 0.35 + 0.05; // Slightly subtler
      
      let style: React.CSSProperties = {
        width: `${size}px`,
        height: `${size}px`,
        opacity: opacity,
        color: 'inherit',
        '--target-opacity': opacity,
      } as React.CSSProperties;

      if (isWander) {
        // Wandering particles (Drifting endlessly on screen)
        const top = Math.random() * 100;
        const left = Math.random() * 100;
        
        // Much longer duration (30s - 70s) for slow, romantic movement
        const duration = Math.random() * 40 + 30; 
        
        // Large drift ranges
        const driftX = (Math.random() - 0.5) * 150; 
        const driftY = (Math.random() - 0.5) * 150;

        style = {
          ...style,
          top: `${top}%`,
          left: `${left}%`,
          animationDuration: `${duration}s`,
          // Negative delay ensures they are already moving/spread out when loaded
          animationDelay: `-${Math.random() * duration}s`,
          
          // CSS Variables for keyframes
          '--drift-x': `${driftX}px`,
          '--drift-y': `${driftY}px`,
          '--rot-1': `${Math.random() * 60 - 30}deg`,
          '--rot-2': `${Math.random() * 120 - 60}deg`,
          '--rot-3': `${Math.random() * 180 - 90}deg`,
        } as React.CSSProperties;
      } else {
        // Floating Up Particles (Rising from bottom with sway)
        const left = Math.random() * 100;
        
        // Long duration for slow rise (25s - 50s)
        const duration = Math.random() * 25 + 25;
        const delay = Math.random() * -30; // Start mid-flight
        
        // Sway amount (sine wave amplitude)
        const sway = (Math.random() - 0.5) * 200; // Wide sway

        style = {
          ...style,
          left: `${left}%`,
          animationDuration: `${duration}s`,
          animationDelay: `${delay}s`,
          
          // CSS Variables for keyframes
          '--sway-x': `${sway}px`,
          '--rot-1': `${Math.random() * 45}deg`,
          '--rot-2': `${Math.random() * 90}deg`,
          '--rot-3': `${Math.random() * 360}deg`,
        } as React.CSSProperties;
      }

      newParticles.push({
        id: i,
        Icon,
        style,
        className: `particle ${color} ${isWander ? 'particle-wander' : 'particle-float'}`
      });
    }

    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((p) => (
        <div
          key={p.id}
          className={p.className}
          style={p.style}
        >
          <p.Icon size="100%" fill={p.Icon === Heart ? "currentColor" : "none"} strokeWidth={1.5} />
        </div>
      ))}
    </div>
  );
};

export default FloatingParticles;