import React, { useState, useEffect, useRef } from 'react';
import type { Topic, Message, StrategistMood } from '../types';
import { TOPICS, TOPIC_CONTEXT, FREE_CONVERSATION_LIMIT, TOTAL_FREE_CONVERSATIONS, EMAIL_CAPTURE_BONUS_CONVERSATIONS } from '../utils/constants';
import { STRATEGIST_GREETING } from '../utils/strategistPersonality';
import { sendMessageToStrategist } from '../services/claudeService';
import { getCachedAudio } from '../services/ttsService';
import { searchYouTubeVideos, type YouTubeVideo } from '../services/videoService';
import { storageService } from '../services/storageService';
import { userProfileService } from '../services/userProfileService';
import { handleAPIError, isRetryableError } from '../utils/errorHandler';
import { retry } from '../utils/retry';
import { useSwipeGesture } from '../utils/swipeGestures';
import StrategistAvatar from './StrategistAvatar';
import SpeechBubble from './SpeechBubble';
import MediaCapture from './MediaCapture';
import VideoSuggestion from './VideoSuggestion';
import ProfessionalReferral from './ProfessionalReferral';
import ErrorMessage from './ErrorMessage';
import LoadingSkeleton from './LoadingSkeleton';
import ConversationCounter from './ConversationCounter';
import EmailCaptureModal from './EmailCaptureModal';
import UpgradePrompt from './UpgradePrompt';

interface StrategySessionProps {
  topic: Topic;
  onChangeTopic: () => void;
}

const StrategySession: React.FC<StrategySessionProps> = ({ topic, onChangeTopic }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [strategistMood, setStrategistMood] = useState<StrategistMood>('idle');
  const [currentMediaUrl, setCurrentMediaUrl] = useState<string | null>(null);
  const [videoSuggestions, setVideoSuggestions] = useState<YouTubeVideo[]>([]);
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const [error, setError] = useState<{ message: string; retryable: boolean } | null>(null);
  
  // Paywall state
  const [conversationCount, setConversationCount] = useState(0);
  const [hasProvidedEmail, setHasProvidedEmail] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const topicConfig = TOPICS.find((t) => t.id === topic)!;

  // Swipe gesture for going back (swipe right)
  const swipeHandlers = useSwipeGesture({
    onSwipeRight: () => {
      onChangeTopic();
    },
    threshold: 100,
  });
  
  // Clear error when starting new message
  useEffect(() => {
    if (inputText || currentMediaUrl) {
      setError(null);
    }
  }, [inputText, currentMediaUrl]);

  useEffect(() => {
    loadSession();
    loadUserProfile();
  }, [topic]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (messages.length > 0) {
      storageService.saveSession({
        topic,
        messages,
        startTime: Date.now(),
        lastActivity: Date.now(),
      });
    }
  }, [messages, topic]);

  const loadUserProfile = async () => {
    try {
      const profile = await userProfileService.getUserProfile();
      setConversationCount(profile.conversationCount);
      setHasProvidedEmail(profile.hasProvidedEmail);
    } catch (error) {
      console.error('Failed to load user profile:', error);
    }
  };

  const loadSession = async () => {
    const session = await storageService.getCurrentSession();
    if (session && session.topic === topic) {
      setMessages(session.messages);
      setShowDisclaimer(false);
    } else {
      const greeting: Message = {
        id: Date.now().toString(),
        role: 'strategist',
        content: STRATEGIST_GREETING(topic),
        timestamp: Date.now(),
      };
      setMessages([greeting]);
      
      try {
        const audioUrl = await getCachedAudio(greeting.content);
        if (audioUrl) {
          setMessages([{ ...greeting, audioUrl }]);
        }
      } catch (error) {
        console.log('TTS not available (expected in local dev)');
      }
    }
  };

  const checkPaywall = async (): Promise<boolean> => {
    const profile = await userProfileService.getUserProfile();
    const limit = profile.hasProvidedEmail ? TOTAL_FREE_CONVERSATIONS : FREE_CONVERSATION_LIMIT;
    
    if (profile.conversationCount >= limit) {
      // Hit the limit
      if (!profile.hasProvidedEmail && profile.conversationCount === FREE_CONVERSATION_LIMIT) {
        setShowEmailModal(true);
        return false;
      } else if (profile.conversationCount >= TOTAL_FREE_CONVERSATIONS) {
        setShowUpgradePrompt(true);
        return false;
      }
    }
    
    return true;
  };

  const handleEmailSubmit = async (email: string) => {
    try {
      await userProfileService.saveEmail(email);
      setHasProvidedEmail(true);
      setShowEmailModal(false);
      
      // Show success message
      const successMessage: Message = {
        id: Date.now().toString(),
        role: 'strategist',
        content: `Great! I've got your email. You now have ${EMAIL_CAPTURE_BONUS_CONVERSATIONS} more free conversations. Let's keep going!`,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, successMessage]);
    } catch (error) {
      console.error('Failed to save email:', error);
      throw error;
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() && !currentMediaUrl) return;

    // Check paywall before allowing message
    const canProceed = await checkPaywall();
    if (!canProceed) return;

    setIsLoading(true);
    setError(null);
    setStrategistMood('listening');
    setVideoSuggestions([]);

    const messageText = inputText;
    const mediaUrl = currentMediaUrl;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText || '(sent a photo)',
      timestamp: Date.now(),
      mediaUrl: mediaUrl || undefined,
      mediaType: mediaUrl ? 'image' : undefined,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setCurrentMediaUrl(null);

    // Increment conversation count
    const newCount = await userProfileService.incrementConversationCount();
    setConversationCount(newCount);

    try {
      setStrategistMood('thinking');

      const response = await retry(
        () => sendMessageToStrategist(
          [...messages, userMessage],
          topic,
          mediaUrl || undefined
        ),
        {
          maxAttempts: 3,
          delay: 1000,
          backoff: 'exponential',
          onRetry: (attempt: number) => {
            console.log(`Retrying API call (attempt ${attempt})`);
          },
        }
      );
      setStrategistMood(response.mood || 'explaining');

      let audioUrl: string | undefined;
      try {
        audioUrl = await getCachedAudio(response.audioText);
      } catch (error) {
        console.log('TTS not available:', error);
      }

      if (response.videoSuggestion) {
        try {
          const videos = await searchYouTubeVideos(
            response.videoSuggestion,
            messageText
          );
          setVideoSuggestions(videos);
        } catch (error) {
          console.error('Video search failed:', error);
        }
      }

      const strategistMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'strategist',
        content: response.message,
        timestamp: Date.now(),
        ...(audioUrl ? { audioUrl } : {}),
        needsProfessional: response.needsDeepWork,
        professionalType: response.escalationType,
      };

      setMessages((prev) => [...prev, strategistMessage]);
    } catch (error) {
      console.error('Failed to get response:', error);
      
      const appError = handleAPIError(error);
      setError({
        message: appError.message,
        retryable: isRetryableError(error),
      });
      
      setStrategistMood('concerned');
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'strategist',
        content: `${appError.message} Want to try again?`,
        timestamp: Date.now(),
      };
      
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setTimeout(() => setStrategistMood('idle'), 2000);
    }
  };

  const handleMediaCaptured = (dataUrl: string, type: 'image' | 'video') => {
    setCurrentMediaUrl(dataUrl);
    storageService.saveMedia(Date.now().toString(), dataUrl, type);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-strategy-primary-light to-white flex flex-col">
      {/* Header */}
      <div className="bg-strategy-primary text-white px-4 py-4 shadow-lg">
        <div className="max-w-4xl mx-auto flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{topicConfig.emoji}</span>
            <div>
              <h2 className="font-display font-bold text-xl">
                {topicConfig.title}
              </h2>
              <p className="text-sm text-strategy-primary-light">
                {TOPIC_CONTEXT[topic]}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <ConversationCounter 
              conversationCount={conversationCount}
              hasProvidedEmail={hasProvidedEmail}
            />
            <button
              onClick={onChangeTopic}
              className="
                px-4 py-2
                min-h-[44px]
                min-w-[80px]
                bg-white/20 text-white
                rounded-full
                hover:bg-white/30
                active:bg-white/30
                touch-manipulation
                transition-colors
                text-sm font-medium
                focus:outline-none focus:ring-2 focus:ring-white
              "
            >
              ← Back
            </button>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      {showDisclaimer && (
        <div className="bg-strategy-accent-light px-4 py-3 shadow-md animate-slide-up">
          <div className="max-w-4xl mx-auto flex items-start gap-3">
            <span className="text-2xl">💡</span>
            <div className="flex-1">
              <p className="text-sm text-gray-700">
                <strong>Quick note:</strong> I'm here to help you think through strategic decisions, 
                but I'm a thinking partner - not a replacement for deep consulting work. 
                I'll let you know when complexity requires a structured approach.
              </p>
            </div>
            <button
              onClick={() => setShowDisclaimer(false)}
              className="text-gray-500 hover:text-gray-700 text-xl min-h-[44px] min-w-[44px] touch-manipulation"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Messages Area */}
      <div 
        className="flex-1 overflow-y-auto px-4 py-6"
        ref={messagesContainerRef}
        {...swipeHandlers}
      >
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.map((message) => (
            <div key={message.id}>
              {message.role === 'strategist' ? (
                <div className="flex flex-col items-start">
                  <StrategistAvatar mood={strategistMood} position={topicConfig.strategistPosition} />
                  <SpeechBubble
                    message={message.content}
                    audioUrl={message.audioUrl}
                    autoPlay={true}
                    onAudioPlay={() => setStrategistMood('explaining')}
                    onAudioEnd={() => setStrategistMood('idle')}
                  />
                  {message.needsProfessional && message.professionalType && (
                    <ProfessionalReferral professionalType={message.professionalType} />
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-end">
                  {message.mediaUrl && (
                    <img
                      src={message.mediaUrl}
                      alt="User uploaded"
                      className="max-w-sm rounded-2xl shadow-md mb-2"
                    />
                  )}
                  <div className="bg-strategy-primary text-white rounded-2xl px-6 py-4 max-w-xl shadow-md">
                    {message.content}
                  </div>
                </div>
              )}
            </div>
          ))}

          {videoSuggestions.length > 0 && (
            <VideoSuggestion videos={videoSuggestions} />
          )}

          {isLoading && (
            <div className="flex flex-col items-start">
              <StrategistAvatar mood={strategistMood} position={topicConfig.strategistPosition} />
              <LoadingSkeleton type="bubble" />
            </div>
          )}

          {error && (
            <div className="flex flex-col items-start">
              <ErrorMessage
                message={error.message}
                retryable={false}
                className="max-w-xl"
              />
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 px-4 py-4 shadow-lg safe-area-bottom">
        <div className="max-w-4xl mx-auto">
          {currentMediaUrl && (
            <div className="mb-3 relative inline-block">
              <img
                src={currentMediaUrl}
                alt="Preview"
                className="h-20 rounded-lg shadow-md"
              />
              <button
                onClick={() => setCurrentMediaUrl(null)}
                className="
                  absolute -top-2 -right-2
                  w-8 h-8 rounded-full
                  bg-red-500 text-white
                  flex items-center justify-center
                  text-sm font-bold
                  hover:bg-red-600 active:bg-red-700
                  shadow-md
                  touch-manipulation
                "
                aria-label="Remove image"
              >
                ✕
              </button>
            </div>
          )}

          <div className="flex gap-3 items-end">
            <MediaCapture
              onMediaCaptured={handleMediaCaptured}
              disabled={isLoading}
            />

            <div className="flex-1 relative">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={isLoading ? 'Strategist is thinking...' : 'What decision are you wrestling with?'}
                disabled={isLoading}
                rows={1}
                className="
                  w-full px-4 py-3
                  min-h-[44px]
                  border-2 border-gray-300
                  rounded-2xl
                  focus:outline-none focus:border-strategy-primary
                  disabled:bg-gray-100 disabled:cursor-not-allowed
                  resize-none
                  font-sans
                  text-base
                  leading-relaxed
                "
                style={{ fontSize: '16px' }}
              />
            </div>

            <button
              onClick={handleSendMessage}
              disabled={isLoading || (!inputText.trim() && !currentMediaUrl)}
              className="
                px-6 py-3
                min-h-[44px]
                min-w-[80px]
                bg-strategy-primary text-white
                rounded-full
                hover:bg-strategy-primary-dark
                active:bg-strategy-primary-dark
                disabled:bg-gray-300 disabled:cursor-not-allowed
                transition-colors
                font-medium
                shadow-md hover:shadow-lg
                touch-manipulation
                flex items-center justify-center
              "
              aria-label="Send message"
            >
              {isLoading ? '...' : 'Send'}
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showEmailModal && (
        <EmailCaptureModal
          conversationCount={conversationCount}
          onEmailSubmit={handleEmailSubmit}
          onClose={() => setShowEmailModal(false)}
        />
      )}

      {showUpgradePrompt && (
        <UpgradePrompt
          conversationCount={conversationCount}
          onClose={() => setShowUpgradePrompt(false)}
        />
      )}
    </div>
  );
};

export default StrategySession;

