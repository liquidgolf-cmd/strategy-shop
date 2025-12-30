import React from 'react';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  retryable?: boolean;
  className?: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ 
  message, 
  onRetry, 
  retryable = false,
  className = ''
}) => {
  return (
    <div className={`bg-dad-accent-red/10 border border-dad-accent-red/30 rounded-xl p-4 ${className}`}>
      <div className="flex items-start gap-3">
        <span className="text-2xl">😅</span>
        <div className="flex-1">
          <p className="text-dad-wood-dark font-medium mb-2">
            {message}
          </p>
          {retryable && onRetry && (
            <button
              onClick={onRetry}
              className="
                px-4 py-2
                bg-dad-blue text-white
                rounded-full
                hover:bg-dad-blue-dark
                transition-colors
                text-sm font-medium
                focus:outline-none focus:ring-2 focus:ring-dad-blue
              "
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorMessage;

