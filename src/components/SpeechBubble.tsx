import React, { useEffect, useRef, useState } from 'react';

interface SpeechBubbleProps {
  message: string;
  audioUrl?: string;
  autoPlay?: boolean;
  onAudioPlay?: () => void;
  onAudioEnd?: () => void;
}

interface MessagePart {
  type: 'text' | 'action';
  content: string;
}

// Parse message and identify action markers
const parseMessage = (text: string): MessagePart[] => {
  const parts: MessagePart[] = [];
  // Match action markers: *text*, _text_, or [text]
  const actionRegex = /(\*[^*]+\*|_[^_]+_|\[[^\]]+\])/g;
  let lastIndex = 0;
  let match;

  while ((match = actionRegex.exec(text)) !== null) {
    // Add text before action marker
    if (match.index > lastIndex) {
      const textContent = text.slice(lastIndex, match.index);
      if (textContent) {
        parts.push({ type: 'text', content: textContent });
      }
    }
    
    // Add action marker (remove the delimiters for display)
    const actionText = match[0]
      .replace(/^\*|\*$/g, '') // Remove asterisks
      .replace(/^_|_$/g, '')   // Remove underscores
      .replace(/^\[|\]$/g, ''); // Remove brackets
    
    parts.push({ type: 'action', content: actionText });
    lastIndex = match.index + match[0].length;
  }
  
  // Add remaining text
  if (lastIndex < text.length) {
    const remainingText = text.slice(lastIndex);
    if (remainingText) {
      parts.push({ type: 'text', content: remainingText });
    }
  }
  
  // If no action markers found, return whole message as text
  if (parts.length === 0) {
    parts.push({ type: 'text', content: text });
  }
  
  return parts;
};

const SpeechBubble: React.FC<SpeechBubbleProps> = ({
  message,
  audioUrl,
  autoPlay = false,
  onAudioPlay,
  onAudioEnd,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const messageParts = parseMessage(message);

  // Validate audioUrl format (must be a valid data URL or http URL)
  const isValidAudioUrl = audioUrl && (
    audioUrl.startsWith('data:audio/') || 
    audioUrl.startsWith('http://') || 
    audioUrl.startsWith('https://')
  );

  useEffect(() => {
    if (isValidAudioUrl && autoPlay && !hasPlayed) {
      playAudio();
      setHasPlayed(true);
    }
  }, [isValidAudioUrl, autoPlay, hasPlayed]);

  const playAudio = async () => {
    if (!audioRef.current || !isValidAudioUrl) return;

    try {
      await audioRef.current.play();
      setIsPlaying(true);
      onAudioPlay?.();
    } catch (error) {
      console.error('Audio playback failed:', error);
      setIsPlaying(false);
      // Audio playback failed - this is OK, just don't play
    }
  };

  const pauseAudio = () => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    setIsPlaying(false);
  };

  const handleAudioEnd = () => {
    setIsPlaying(false);
    onAudioEnd?.();
  };

  return (
    <div className="speech-bubble animate-slide-up max-w-xl">
      <div className="text-gray-800 leading-relaxed whitespace-pre-wrap">
        {messageParts.map((part, index) => {
          if (part.type === 'action') {
            return (
              <span
                key={index}
                className="italic text-gray-500 text-sm"
                title="Action"
              >
                {part.content}
              </span>
            );
          }
          return <span key={index}>{part.content}</span>;
        })}
      </div>

      {isValidAudioUrl && (
        <div className="mt-4 flex items-center gap-3">
          <button
            onClick={isPlaying ? pauseAudio : playAudio}
            className="
              flex items-center gap-2
              px-4 py-2
              min-h-[44px]
              bg-dad-blue text-white
              rounded-full
              hover:bg-dad-blue-dark
              active:bg-dad-blue-dark
              transition-colors
              focus:outline-none focus:ring-2 focus:ring-dad-blue
              touch-manipulation
            "
            aria-label={isPlaying ? 'Pause' : 'Play audio'}
          >
            {isPlaying ? (
              <>
                <span className="text-xl">⏸️</span>
                <span className="text-sm font-medium">Pause</span>
              </>
            ) : (
              <>
                <span className="text-xl">🔊</span>
                <span className="text-sm font-medium">
                  {hasPlayed ? 'Replay' : 'Listen'}
                </span>
              </>
            )}
          </button>

          {isPlaying && (
            <div className="flex gap-1 items-center">
              <div className="w-1 h-3 bg-dad-blue animate-thinking rounded"></div>
              <div className="w-1 h-4 bg-dad-blue animate-thinking rounded" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-1 h-3 bg-dad-blue animate-thinking rounded" style={{ animationDelay: '0.4s' }}></div>
            </div>
          )}
        </div>
      )}

      {isValidAudioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          onEnded={handleAudioEnd}
          onError={(e) => {
            console.error('Audio element error:', e);
            setIsPlaying(false);
          }}
          preload="auto"
        />
      )}
    </div>
  );
};

export default SpeechBubble;

