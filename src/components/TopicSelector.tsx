import React from 'react';
import type { Topic } from '../types';
import { TOPICS } from '../utils/constants';

interface TopicSelectorProps {
  onSelectTopic: (topic: Topic) => void;
}

const TopicSelector: React.FC<TopicSelectorProps> = ({ onSelectTopic }) => {
  const [hoveredTopic, setHoveredTopic] = React.useState<Topic | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-dad-warm-light via-dad-blue-light to-dad-green-light flex flex-col items-center justify-center p-4">
      <div className="text-center mb-12 animate-fade-in">
        <h1 className="text-5xl md:text-6xl font-display font-bold text-dad-wood-dark mb-4">
          Hey there! 👋
        </h1>
        <p className="text-xl md:text-2xl text-dad-wood mb-2">
          I'm Dad, and I'm here to help!
        </p>
        <p className="text-lg text-gray-600">
          What do you need help with today?
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl w-full">
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
              focus:outline-none focus:ring-4 focus:ring-dad-blue
              ${hoveredTopic === topic.id ? 'transform scale-105' : ''}
            `}
          >
            <div className="text-6xl mb-4 transition-transform duration-300 hover:scale-110">
              {topic.emoji}
            </div>
            <h3 className="text-2xl font-display font-bold text-dad-wood-dark mb-2">
              {topic.title}
            </h3>
            <p className="text-gray-600">
              {topic.description}
            </p>
            
            {/* Hover effect */}
            <div 
              className={`
                absolute bottom-0 left-0 right-0 h-1
                bg-gradient-to-r from-dad-blue to-dad-green
                transition-all duration-300
                ${hoveredTopic === topic.id ? 'h-2' : 'h-0'}
              `}
            />
          </button>
        ))}
      </div>

      <div className="mt-12 text-center text-sm text-gray-500 max-w-2xl animate-fade-in">
        <p className="mb-2">
          💡 <strong>Pro tip:</strong> I'm here to help with common problems and tough decisions, 
          but I'll always let you know when something needs a professional.
        </p>
        <p>
          Your safety and wellbeing come first! 🛡️
        </p>
      </div>
    </div>
  );
};

export default TopicSelector;

