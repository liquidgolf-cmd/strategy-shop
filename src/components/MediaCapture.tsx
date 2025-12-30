import React, { useRef, useState } from 'react';
import { compressImage } from '../utils/imageProcessor';

interface MediaCaptureProps {
  onMediaCaptured: (dataUrl: string, type: 'image' | 'video') => void;
  disabled?: boolean;
}

const MediaCapture: React.FC<MediaCaptureProps> = ({ onMediaCaptured, disabled }) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);

    try {
      if (file.type.startsWith('image/')) {
        const compressed = await compressImage(file);
        onMediaCaptured(compressed, 'image');
      } else if (file.type.startsWith('video/')) {
        // For video, we'll just read it as data URL for now
        // In production, you might want to extract a frame or upload to storage
        const reader = new FileReader();
        reader.onload = (e) => {
          onMediaCaptured(e.target?.result as string, 'video');
        };
        reader.readAsDataURL(file);
      }
    } catch (error) {
      console.error('Failed to process media:', error);
      alert('Failed to process media. Please try again.');
    } finally {
      setIsProcessing(false);
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        capture="environment"
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled || isProcessing}
      />

      <button
        onClick={triggerFileSelect}
        disabled={disabled || isProcessing}
        className="
          p-4 rounded-full
          bg-dad-green text-white
          hover:bg-dad-green-dark
          active:bg-dad-green-dark
          disabled:bg-gray-300 disabled:cursor-not-allowed
          transition-colors
          shadow-md hover:shadow-lg
          focus:outline-none focus:ring-2 focus:ring-dad-green
          min-h-[56px] min-w-[56px]
          flex items-center justify-center
          touch-manipulation
        "
        title="Take a photo or video"
        aria-label="Capture photo or video"
      >
        {isProcessing ? (
          <span className="text-2xl animate-spin inline-block">⏳</span>
        ) : (
          <span className="text-2xl">📷</span>
        )}
      </button>
    </>
  );
};

export default MediaCapture;

