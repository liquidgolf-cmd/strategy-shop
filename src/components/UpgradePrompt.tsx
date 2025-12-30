import React from 'react';

interface UpgradePromptProps {
  conversationCount: number;
  onClose: () => void;
}

const UpgradePrompt: React.FC<UpgradePromptProps> = ({ conversationCount, onClose }) => {
  // Placeholder for Clarity Sprint booking link (Phase 2)
  const claritySprintUrl = 'https://loamstrategy.com'; // TODO: Replace with actual booking link

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-8 animate-slide-up max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="text-6xl mb-4">🚀</div>
          <h2 className="text-3xl font-display font-bold text-strategy-neutral-dark mb-3">
            You're tackling some complex stuff...
          </h2>
          <p className="text-gray-600">
            After {conversationCount} strategy conversations, I'm seeing patterns.
          </p>
        </div>

        {/* Insights Section */}
        <div className="bg-strategy-primary-light rounded-2xl p-6 mb-8">
          <h3 className="font-display font-bold text-strategy-neutral-dark mb-3">
            What I'm noticing:
          </h3>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-strategy-primary mt-1">•</span>
              <span>You're asking the right questions, but need deeper strategic work</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-strategy-primary mt-1">•</span>
              <span>Multiple priorities competing for attention</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-strategy-primary mt-1">•</span>
              <span>You'd benefit from structured clarity and a 90-day roadmap</span>
            </li>
          </ul>
        </div>

        {/* Options */}
        <div className="space-y-4 mb-6">
          {/* Option 1: Monthly Access (Phase 2 - not functional yet) */}
          <div className="border-2 border-gray-200 rounded-2xl p-6 opacity-50">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-display font-bold text-strategy-neutral-dark text-xl mb-1">
                  Keep Going Solo
                </h3>
                <p className="text-gray-600 text-sm">
                  Unlimited Strategy Shop conversations
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-strategy-neutral-dark">$19</p>
                <p className="text-xs text-gray-500">/month</p>
              </div>
            </div>
            <button
              disabled
              className="
                w-full px-6 py-3
                bg-gray-300 text-gray-500
                rounded-xl
                cursor-not-allowed
                font-medium
                min-h-[44px]
              "
            >
              Coming Soon
            </button>
          </div>

          {/* Option 2: Clarity Sprint (Active) */}
          <div className="border-2 border-strategy-primary rounded-2xl p-6 bg-strategy-primary-light/30">
            <div className="mb-4">
              <div className="inline-block bg-strategy-primary text-white text-xs font-bold px-3 py-1 rounded-full mb-2">
                RECOMMENDED
              </div>
              <h3 className="font-display font-bold text-strategy-neutral-dark text-xl mb-1">
                Let's Go Deep Together
              </h3>
              <p className="text-gray-700 text-sm mb-3">
                Book a <strong>HomeRun Clarity Sprint</strong> with Mike
              </p>
              <ul className="space-y-1 text-sm text-gray-700 mb-3">
                <li className="flex items-start gap-2">
                  <span>✓</span>
                  <span>Complete 90-day strategy in 2 weeks</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>✓</span>
                  <span>Clear priorities and action plan</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>✓</span>
                  <span>Direct access to experienced strategist</span>
                </li>
              </ul>
              <p className="text-sm text-gray-600">
                Investment: <strong>$2,500-4,000</strong>
              </p>
            </div>
            <a
              href={claritySprintUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="
                block w-full
                px-6 py-3
                bg-strategy-primary text-white
                rounded-xl
                hover:bg-strategy-primary-dark
                transition-colors
                font-medium text-center
                shadow-md hover:shadow-lg
                min-h-[44px] touch-manipulation
              "
            >
              See If You Qualify →
            </a>
          </div>

          {/* Option 3: Stay on Email List */}
          <div className="border-2 border-gray-200 rounded-2xl p-6">
            <h3 className="font-display font-bold text-strategy-neutral-dark text-lg mb-2">
              I'm Not Ready Yet
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              Stay on our email list for free strategic insights and frameworks
            </p>
            <button
              onClick={onClose}
              className="
                w-full px-6 py-3
                bg-white text-strategy-neutral-dark
                border-2 border-gray-300
                rounded-xl
                hover:bg-gray-50
                transition-colors
                font-medium
                min-h-[44px] touch-manipulation
              "
            >
              Keep Me Updated
            </button>
          </div>
        </div>

        {/* Close button */}
        <div className="text-center">
          <button
            onClick={onClose}
            className="text-sm text-gray-500 hover:text-gray-700 underline"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpgradePrompt;

