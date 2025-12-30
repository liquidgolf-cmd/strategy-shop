import React, { useState } from 'react';
import type { YouTubeVideo } from '../services/videoService';

interface VideoSuggestionProps {
  videos: YouTubeVideo[];
}

const VideoSuggestion: React.FC<VideoSuggestionProps> = ({ videos }) => {
  const [selectedVideo, setSelectedVideo] = useState<YouTubeVideo | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  if (videos.length === 0) return null;

  return (
    <div className="my-4 animate-slide-up">
      <div className="bg-dad-wood-light rounded-2xl p-4 shadow-md">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-2xl">📹</span>
          <h3 className="font-display font-bold text-dad-wood-dark text-lg">
            Dad found some helpful videos:
          </h3>
        </div>

        {!isExpanded ? (
          <div className="space-y-2">
            {videos.slice(0, 1).map((video) => (
              <button
                key={video.id}
                onClick={() => {
                  setSelectedVideo(video);
                  setIsExpanded(true);
                }}
                className="
                  w-full flex items-start gap-3 p-3
                  bg-white rounded-xl
                  hover:bg-gray-50
                  transition-colors
                  text-left
                "
              >
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-24 h-18 object-cover rounded-lg flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-800 text-sm line-clamp-2">
                    {video.title}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {video.channelTitle}
                  </p>
                </div>
              </button>
            ))}

            {videos.length > 1 && (
              <button
                onClick={() => setIsExpanded(true)}
                className="
                  w-full text-center py-2
                  text-dad-blue hover:text-dad-blue-dark
                  text-sm font-medium
                  transition-colors
                "
              >
                See {videos.length - 1} more video{videos.length > 2 ? 's' : ''}
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {selectedVideo && (
              <div className="bg-black rounded-xl overflow-hidden">
                <iframe
                  width="100%"
                  height="315"
                  src={`https://www.youtube.com/embed/${selectedVideo.id}`}
                  title={selectedVideo.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full aspect-video"
                />
              </div>
            )}

            <div className="grid grid-cols-1 gap-2">
              {videos.map((video) => (
                <button
                  key={video.id}
                  onClick={() => setSelectedVideo(video)}
                  className={`
                    flex items-start gap-3 p-3
                    rounded-xl
                    transition-colors
                    text-left
                    ${selectedVideo?.id === video.id
                      ? 'bg-dad-blue-light'
                      : 'bg-white hover:bg-gray-50'
                    }
                  `}
                >
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-20 h-15 object-cover rounded-lg flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 text-sm line-clamp-2">
                      {video.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {video.channelTitle}
                    </p>
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                setIsExpanded(false);
                setSelectedVideo(null);
              }}
              className="
                w-full text-center py-2
                text-gray-500 hover:text-gray-700
                text-sm
                transition-colors
              "
            >
              Collapse videos
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoSuggestion;

