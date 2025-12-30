import React, { useEffect, useState } from 'react';
import type { Topic, ConversationSession } from '../types';
import { TOPICS } from '../utils/constants';
import { storageService } from '../services/storageService';
import { userProfileService } from '../services/userProfileService';

interface MainHubProps {
  onSelectTopic: (topic: Topic) => void;
  onSelectRecentSession?: (session: ConversationSession) => void;
}

const MainHub: React.FC<MainHubProps> = ({ onSelectTopic, onSelectRecentSession }) => {
  const [recentSessions, setRecentSessions] = useState<ConversationSession[]>([]);
  const [hoveredTopic, setHoveredTopic] = useState<Topic | null>(null);
  const [showRecentMenu, setShowRecentMenu] = useState(false);
  const [conversationCount, setConversationCount] = useState(0);

  useEffect(() => {
    loadRecentSessions();
    loadConversationCount();
  }, []);

  const loadRecentSessions = async () => {
    try {
      const sessions = await storageService.getAllSessions();
      setRecentSessions(sessions.slice(0, 5));
    } catch (error) {
      console.error('Failed to load recent sessions:', error);
    }
  };

  const loadConversationCount = async () => {
    try {
      const count = await userProfileService.getConversationCount();
      setConversationCount(count);
    } catch (error) {
      console.error('Failed to load conversation count:', error);
    }
  };

  const getTopicTitle = (topicId: Topic): string => {
    return TOPICS.find(t => t.id === topicId)?.title || topicId;
  };

  const formatTimeAgo = (timestamp: number): string => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-strategy-primary-light via-white to-strategy-accent-light">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-strategy-neutral-dark mb-4">
            What's your toughest business decision right now?
          </h1>
          <p className="text-xl md:text-2xl text-strategy-neutral mb-4">
            Let's think it through together.
          </p>
          {conversationCount === 0 && (
            <div className="inline-block bg-strategy-success/10 border border-strategy-success rounded-full px-6 py-2 mt-2">
              <p className="text-sm font-medium text-strategy-success">
                ✨ 3 free strategy conversations to get started
              </p>
            </div>
          )}
        </div>

        {/* Recent Conversations Menu Button */}
        {recentSessions.length > 0 && (
          <div className="mb-8 flex justify-center">
            <button
              onClick={() => setShowRecentMenu(!showRecentMenu)}
              className="
                px-6 py-3
                min-h-[44px]
                bg-white text-strategy-neutral-dark
                rounded-full shadow-md
                hover:shadow-lg hover:scale-105
                transition-all duration-300
                focus:outline-none focus:ring-4 focus:ring-strategy-primary
                flex items-center gap-2
                font-medium
                touch-manipulation
              "
            >
              <span>📋</span>
              <span>Recent Conversations ({recentSessions.length})</span>
              <span className={`transition-transform duration-300 ${showRecentMenu ? 'rotate-180' : ''}`}>
                ▼
              </span>
            </button>
          </div>
        )}

        {/* Recent Conversations Dropdown Menu */}
        {showRecentMenu && recentSessions.length > 0 && (
          <div className="mb-8 max-w-2xl mx-auto animate-slide-up">
            <div className="bg-white rounded-2xl shadow-xl p-6 space-y-3">
              {recentSessions.map((session) => {
                const topicConfig = TOPICS.find(t => t.id === session.topic);
                return (
                  <button
                    key={session.startTime}
                    onClick={() => {
                      onSelectRecentSession?.(session);
                      setShowRecentMenu(false);
                    }}
                    className="
                      w-full
                      bg-gray-50 rounded-xl
                      p-4 text-left
                      hover:bg-strategy-primary-light hover:shadow-md
                      transition-all duration-200
                      focus:outline-none focus:ring-2 focus:ring-strategy-primary
                      flex items-center gap-4
                      min-h-[44px] touch-manipulation
                    "
                  >
                    <div className="text-3xl">
                      {topicConfig?.emoji || '💬'}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-display font-bold text-strategy-neutral-dark text-base mb-1">
                        {topicConfig?.title || getTopicTitle(session.topic)}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {session.messages.length} messages • {formatTimeAgo(session.lastActivity)}
                      </p>
                    </div>
                    <span className="text-gray-400">→</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Topic Selection */}
        <div className="mb-8">
          <h2 className="text-2xl font-display font-bold text-strategy-neutral-dark mb-6 text-center">
            Choose Your Challenge
          </h2>
        </div>

        {/* Topic Selector Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {TOPICS.map((topic) => (
            <button
              key={topic.id}
              onClick={() => onSelectTopic(topic.id)}
              onMouseEnter={() => setHoveredTopic(topic.id)}
              onMouseLeave={() => setHoveredTopic(null)}
              className={`
                relative overflow-hidden
                bg-white rounded-3xl shadow-lg
                p-8 text-left
                transition-all duration-300 ease-out
                hover:shadow-2xl hover:scale-105
                focus:outline-none focus:ring-4 focus:ring-strategy-primary
                ${hoveredTopic === topic.id ? 'transform scale-105' : ''}
                min-h-[160px] touch-manipulation
              `}
            >
              <div className="text-6xl mb-4 transition-transform duration-300 hover:scale-110">
                {topic.emoji}
              </div>
              <h3 className="text-2xl font-display font-bold text-strategy-neutral-dark mb-2">
                {topic.title}
              </h3>
              <p className="text-gray-600 text-sm">
                {topic.description}
              </p>
              
              {/* Hover effect */}
              <div 
                className={`
                  absolute bottom-0 left-0 right-0 h-1
                  bg-gradient-to-r from-strategy-primary to-strategy-accent
                  transition-all duration-300
                  ${hoveredTopic === topic.id ? 'h-2' : 'h-0'}
                `}
              />
            </button>
          ))}
        </div>

        {/* Footer tip */}
        <div className="mt-12 text-center text-sm text-gray-500 max-w-2xl mx-auto animate-fade-in">
          <p className="mb-2">
            💡 <strong>How it works:</strong> Share your challenge, and I'll ask clarifying questions to help you think it through. 
            Sometimes you just need someone who's been there to help you see clearly.
          </p>
          <p>
            When complexity requires deep work, I'll let you know. 🎯
          </p>
        </div>
      </div>
    </div>
  );
};

export default MainHub;
