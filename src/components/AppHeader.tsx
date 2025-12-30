import React from 'react';

interface AppHeaderProps {
  onHomeClick: () => void;
  showHomeButton?: boolean;
}

const AppHeader: React.FC<AppHeaderProps> = ({ onHomeClick, showHomeButton = true }) => {
  return (
    <header className="w-full bg-white/90 backdrop-blur-sm shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo/Title */}
        <button
          onClick={onHomeClick}
          className="
            flex items-center gap-3
            focus:outline-none focus:ring-2 focus:ring-strategy-primary rounded-lg
            transition-opacity hover:opacity-80
          "
        >
          <img src="/strategy-shop-logo.png" alt="The Strategy Shop" className="h-10 w-10 object-contain" />
          <span className="text-lg md:text-xl font-display font-bold text-strategy-neutral-dark">
            The Strategy Shop
          </span>
        </button>

        {/* Home Button (optional, shown when not on home) */}
            {showHomeButton && (
              <button
                onClick={onHomeClick}
                className="
                  px-4 py-2
                  min-h-[44px]
                  min-w-[80px]
                  text-strategy-primary
                  font-medium
                  rounded-lg
                  hover:bg-strategy-primary-light
                  active:bg-strategy-primary-light
                  transition-colors
                  focus:outline-none focus:ring-2 focus:ring-strategy-primary
                  touch-manipulation
                "
              >
                Home
              </button>
            )}
      </div>
    </header>
  );
};

export default AppHeader;

