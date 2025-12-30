import React, { useState } from 'react';
import { EMAIL_CAPTURE_BONUS_CONVERSATIONS } from '../utils/constants';

interface EmailCaptureModalProps {
  conversationCount: number;
  onEmailSubmit: (email: string) => void;
  onClose: () => void;
}

const EmailCaptureModal: React.FC<EmailCaptureModalProps> = ({ 
  conversationCount, 
  onEmailSubmit, 
  onClose 
}) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    try {
      await onEmailSubmit(email);
      // Modal will be closed by parent component
    } catch (err) {
      setError('Something went wrong. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 animate-slide-up">
        {/* Icon */}
        <div className="text-center mb-6">
          <div className="text-6xl mb-4">🎯</div>
          <h2 className="text-3xl font-display font-bold text-strategy-neutral-dark mb-2">
            You're asking great questions...
          </h2>
        </div>

        {/* Message */}
        <div className="mb-6 space-y-3">
          <p className="text-gray-700 text-center">
            You've used <strong>{conversationCount} of your free strategy conversations</strong>.
          </p>
          <p className="text-gray-700 text-center">
            To continue getting strategic clarity:
          </p>
        </div>

        {/* Benefits */}
        <div className="bg-strategy-primary-light rounded-2xl p-4 mb-6 space-y-2">
          <div className="flex items-start gap-3">
            <span className="text-xl">✉️</span>
            <div className="flex-1">
              <p className="text-sm font-medium text-strategy-neutral-dark">
                Get {EMAIL_CAPTURE_BONUS_CONVERSATIONS} more free conversations
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-xl">📊</span>
            <div className="flex-1">
              <p className="text-sm font-medium text-strategy-neutral-dark">
                Receive conversation summaries
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-xl">🧠</span>
            <div className="flex-1">
              <p className="text-sm font-medium text-strategy-neutral-dark">
                Unlock the Strategy Framework Library
              </p>
            </div>
          </div>
        </div>

        {/* Email Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              disabled={isSubmitting}
              className="
                w-full px-4 py-3
                border-2 border-gray-300
                rounded-xl
                focus:outline-none focus:border-strategy-primary
                disabled:bg-gray-100 disabled:cursor-not-allowed
                text-base
                min-h-[44px]
              "
              style={{ fontSize: '16px' }} // Prevent iOS zoom
            />
            {error && (
              <p className="text-sm text-red-600 mt-2">{error}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="
              w-full
              px-6 py-3
              bg-strategy-primary text-white
              rounded-xl
              hover:bg-strategy-primary-dark
              disabled:bg-gray-300 disabled:cursor-not-allowed
              transition-colors
              font-medium text-base
              shadow-md hover:shadow-lg
              min-h-[44px] touch-manipulation
            "
          >
            {isSubmitting ? 'Saving...' : 'Continue for Free'}
          </button>
        </form>

        {/* Alternative option */}
        <div className="mt-6 text-center">
          <button
            onClick={onClose}
            className="text-sm text-gray-500 hover:text-gray-700 underline"
          >
            Maybe later
          </button>
        </div>

        {/* Privacy note */}
        <p className="mt-6 text-xs text-gray-500 text-center">
          No spam, ever. Unsubscribe anytime. We respect your inbox.
        </p>
      </div>
    </div>
  );
};

export default EmailCaptureModal;

