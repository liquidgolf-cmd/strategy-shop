import React from 'react';

interface SplashScreenProps {
  onEnter: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onEnter }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-strategy-primary-light via-white to-strategy-accent-light flex flex-col items-center justify-center p-4 animate-fade-in">
      <div className="text-center max-w-3xl animate-slide-up">
        {/* App Logo/Title */}
        <div className="mb-8">
          <div className="flex flex-col items-center mb-6">
            {/* Professional logo - using emoji for Phase 1, can replace with actual logo later */}
            <div className="text-8xl md:text-9xl mb-4 animate-fade-in">
              💼
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold text-strategy-neutral-dark leading-tight mb-2">
              The Strategy Shop
            </h1>
            <p className="text-xl md:text-2xl font-display text-strategy-primary">
              Your Business Strategy Thinking Partner
            </p>
          </div>
        </div>

        {/* Welcome Message */}
        <div className="mb-12 space-y-4">
          <p className="text-2xl md:text-3xl font-display text-strategy-neutral-dark mb-6 font-semibold">
            Make better business decisions in minutes, not weeks.
          </p>
          <p className="text-lg md:text-xl text-strategy-neutral leading-relaxed max-w-2xl mx-auto">
            Get strategic clarity on your toughest business questions - hiring, pricing, marketing, pivots, or growth - through conversation with an experienced strategist who's seen it all.
          </p>
        </div>

        {/* Value Props */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-3xl mx-auto">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 shadow-md">
            <div className="text-3xl mb-2">🎯</div>
            <h3 className="font-display font-bold text-strategy-neutral-dark mb-1">Clear Decisions</h3>
            <p className="text-sm text-gray-600">Cut through the noise</p>
          </div>
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 shadow-md">
            <div className="text-3xl mb-2">⚡</div>
            <h3 className="font-display font-bold text-strategy-neutral-dark mb-1">Quick Clarity</h3>
            <p className="text-sm text-gray-600">Minutes, not meetings</p>
          </div>
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 shadow-md">
            <div className="text-3xl mb-2">🧠</div>
            <h3 className="font-display font-bold text-strategy-neutral-dark mb-1">Proven Frameworks</h3>
            <p className="text-sm text-gray-600">Battle-tested strategies</p>
          </div>
        </div>

        {/* Enter Button */}
        <button
          onClick={onEnter}
          className="
            px-12 py-5
            bg-strategy-primary text-white
            text-xl font-display font-bold
            rounded-full
            shadow-2xl
            hover:bg-strategy-primary-dark
            hover:shadow-3xl
            hover:scale-105
            transition-all duration-300
            focus:outline-none focus:ring-4 focus:ring-strategy-primary
            min-h-[44px] min-w-[44px] touch-manipulation
          "
        >
          Start Strategy Session
        </button>

        {/* Subtle tagline */}
        <div className="mt-8 space-y-2">
          <p className="text-sm text-gray-600">
            <span className="font-semibold">3 free strategy conversations</span> to get you started
          </p>
          <p className="text-xs text-gray-500">
            No credit card required. Just real strategic thinking.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
