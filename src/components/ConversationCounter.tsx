import React from 'react';
import { FREE_CONVERSATION_LIMIT, TOTAL_FREE_CONVERSATIONS } from '../utils/constants';

interface ConversationCounterProps {
  conversationCount: number;
  hasProvidedEmail: boolean;
}

const ConversationCounter: React.FC<ConversationCounterProps> = ({ 
  conversationCount, 
  hasProvidedEmail 
}) => {
  const limit = hasProvidedEmail ? TOTAL_FREE_CONVERSATIONS : FREE_CONVERSATION_LIMIT;
  const remaining = Math.max(0, limit - conversationCount);
  
  // Don't show if they've exceeded the limit
  if (conversationCount >= limit) {
    return null;
  }

  // Calculate progress percentage
  const progressPercent = (conversationCount / limit) * 100;

  // Determine color based on remaining conversations
  const getColorClass = () => {
    if (remaining <= 1) return 'text-strategy-warning';
    if (remaining <= 2) return 'text-strategy-accent';
    return 'text-strategy-neutral';
  };

  const getProgressColorClass = () => {
    if (remaining <= 1) return 'bg-strategy-warning';
    if (remaining <= 2) return 'bg-strategy-accent';
    return 'bg-strategy-primary';
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-md inline-flex items-center gap-3">
      {/* Progress bar */}
      <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className={`h-full ${getProgressColorClass()} transition-all duration-300`}
          style={{ width: `${progressPercent}%` }}
        />
      </div>
      
      {/* Counter text */}
      <div className={`text-sm font-medium ${getColorClass()} whitespace-nowrap`}>
        {remaining === 0 ? (
          <span>Last free conversation</span>
        ) : (
          <span>
            {remaining} of {limit} free {remaining === 1 ? 'conversation' : 'conversations'}
          </span>
        )}
      </div>
    </div>
  );
};

export default ConversationCounter;

