import React from 'react';

interface LoadingSkeletonProps {
  type?: 'message' | 'bubble' | 'card';
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ type = 'message' }) => {
  if (type === 'message') {
    return (
      <div className="flex flex-col items-start animate-pulse">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-gray-300 rounded-full"></div>
          <div className="h-4 w-20 bg-gray-300 rounded"></div>
        </div>
        <div className="speech-bubble bg-gray-200 min-h-[80px] w-full max-w-xl">
          <div className="space-y-2 p-4">
            <div className="h-4 bg-gray-300 rounded w-full"></div>
            <div className="h-4 bg-gray-300 rounded w-5/6"></div>
            <div className="h-4 bg-gray-300 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'bubble') {
    return (
      <div className="speech-bubble animate-pulse bg-gray-200 min-h-[60px] w-full max-w-xl">
        <div className="space-y-2 p-4">
          <div className="h-3 bg-gray-300 rounded w-full"></div>
          <div className="h-3 bg-gray-300 rounded w-4/5"></div>
        </div>
      </div>
    );
  }

  if (type === 'card') {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 animate-pulse">
        <div className="space-y-4">
          <div className="h-6 bg-gray-300 rounded w-3/4"></div>
          <div className="h-4 bg-gray-300 rounded w-full"></div>
          <div className="h-4 bg-gray-300 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  return null;
};

export default LoadingSkeleton;

