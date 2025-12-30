import React, { useEffect, useState } from 'react';
import type { StrategistMood } from '../types';

interface StrategistAvatarProps {
  mood: StrategistMood;
  position: 'left' | 'right';
}

const StrategistAvatar: React.FC<StrategistAvatarProps> = ({ mood, position }) => {
  const [isAnimating, setIsAnimating] = useState(false);

  // Trigger entrance animation when mood changes
  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 600);
    return () => clearTimeout(timer);
  }, [mood]);

  const getMoodEmoji = (): string => {
    switch (mood) {
      case 'listening': return '👂';
      case 'thinking': return '🤔';
      case 'analyzing': return '🧠';
      case 'explaining': return '💡';
      case 'concerned': return '🤨';
      case 'encouraging': return '💪';
      case 'confident': return '✅';
      case 'surprised': return '😲';
      case 'challenging': return '🎯';
      default: return '💼'; // Professional briefcase for idle
    }
  };

  const getMoodAnimation = (): string => {
    switch (mood) {
      case 'idle': return 'animate-avatar-idle';
      case 'listening': return 'animate-avatar-listening';
      case 'thinking': return 'animate-avatar-thinking';
      case 'analyzing': return 'animate-avatar-analyzing';
      case 'explaining': return 'animate-avatar-explaining';
      case 'concerned': return 'animate-avatar-concerned';
      case 'encouraging': return 'animate-avatar-encouraging';
      case 'confident': return 'animate-avatar-confident';
      case 'surprised': return isAnimating ? 'animate-avatar-surprised' : 'animate-avatar-idle';
      case 'challenging': return 'animate-avatar-challenging';
      default: return 'animate-avatar-idle';
    }
  };

  const getRingAnimation = (): string => {
    if (mood === 'concerned') return 'animate-ring-concerned';
    if (mood !== 'idle') return 'animate-ring-pulse';
    return '';
  };

  const getRingColor = (): string => {
    switch (mood) {
      case 'concerned': return 'border-strategy-warning';
      case 'confident':
      case 'encouraging': return 'border-strategy-success';
      case 'challenging': return 'border-strategy-accent';
      default: return 'border-strategy-primary';
    }
  };

  const getMoodLabel = (): string => {
    switch (mood) {
      case 'thinking': return 'Thinking...';
      case 'listening': return 'Listening...';
      case 'analyzing': return 'Analyzing...';
      case 'explaining': return 'Got it...';
      case 'encouraging': return "You've got this";
      case 'confident': return 'Clear path ahead';
      case 'challenging': return 'Let me push back...';
      default: return mood;
    }
  };

  return (
    <div
      className={`
        flex flex-col items-center
        ${position === 'left' ? 'mr-auto' : 'ml-auto'}
        mb-4
      `}
    >
      <div
        className={`
          relative
          w-24 h-24 md:w-32 md:h-32
          bg-gradient-to-br from-strategy-primary-light to-strategy-primary
          rounded-full
          flex items-center justify-center
          shadow-xl
          ${getMoodAnimation()}
          transition-all duration-500 ease-out
          transform-gpu
        `}
      >
        {/* Emoji container with smooth transitions */}
        <div 
          className={`
            text-5xl md:text-6xl
            transition-all duration-300 ease-out
            ${mood === 'surprised' && isAnimating ? 'scale-110' : 'scale-100'}
          `}
        >
          {getMoodEmoji()}
        </div>
        
        {/* Enhanced mood indicator ring */}
        <div
          className={`
            absolute inset-0
            rounded-full
            border-4
            ${getRingColor()}
            ${mood !== 'idle' ? getRingAnimation() : 'opacity-0'}
            transition-all duration-500
            ${mood !== 'idle' ? 'opacity-100' : 'opacity-0'}
          `}
        />
        
        {/* Additional glow effect for active moods */}
        {mood !== 'idle' && mood !== 'concerned' && (
          <div
            className={`
              absolute inset-0
              rounded-full
              ${mood === 'confident' || mood === 'encouraging' 
                ? 'bg-strategy-success' 
                : 'bg-strategy-primary'
              }
              opacity-20
              ${getRingAnimation()}
              blur-xl
              -z-10
            `}
          />
        )}
      </div>

      {/* Strategist label with smooth transitions */}
      <div className="mt-2 text-center">
        <p className="font-display font-bold text-strategy-neutral-dark text-lg transition-all duration-300">
          The Strategist
        </p>
        {mood !== 'idle' && (
          <p 
            className={`
              text-xs text-gray-500
              transition-all duration-300 ease-out
              ${isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}
            `}
          >
            {getMoodLabel()}
          </p>
        )}
      </div>
    </div>
  );
};

export default StrategistAvatar;

