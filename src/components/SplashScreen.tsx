import React from 'react';
import { TOPICS } from '../utils/constants';

interface SplashScreenProps {
  onEnter: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onEnter }) => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-4">
              <img 
                src="/strategy-shop-logo.png" 
                alt="The Strategy Shop" 
                className="h-14 w-14 object-contain"
              />
              <span className="text-2xl font-display font-bold text-strategy-neutral-dark">
                The Strategy Shop
              </span>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            {/* Prominent Logo */}
            <div className="flex justify-center mb-8">
              <img 
                src="/strategy-shop-logo.png" 
                alt="The Strategy Shop" 
                className="h-24 w-24 sm:h-32 sm:w-32 object-contain animate-fade-in"
              />
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold text-strategy-neutral-dark leading-tight mb-6">
              Strategic Clarity for Your Toughest Business Decisions
            </h1>
            <p className="text-xl sm:text-2xl text-strategy-neutral leading-relaxed mb-8 max-w-3xl mx-auto">
              Make better business decisions in minutes, not weeks. Get expert strategic guidance on hiring, pricing, marketing, pivots, and growth through intelligent conversation.
            </p>
            <button
              onClick={onEnter}
              className="
                px-12 py-5
                bg-strategy-primary text-white
                text-xl font-display font-bold
                rounded-lg
                shadow-lg
                hover:bg-strategy-primary-dark
                hover:shadow-xl
                hover:scale-105
                transition-all duration-300
                focus:outline-none focus:ring-4 focus:ring-strategy-primary/50
                min-h-[44px] min-w-[44px] touch-manipulation
              "
            >
              Start Strategy Session
            </button>
            <div className="mt-6 flex items-center justify-center gap-4 text-sm text-gray-600">
              <span className="font-semibold">3 free conversations</span>
              <span className="text-gray-400">•</span>
              <span>No credit card required</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-display font-bold text-strategy-neutral-dark mb-4">
              Why Business Leaders Choose The Strategy Shop
            </h2>
            <p className="text-lg text-strategy-neutral max-w-2xl mx-auto">
              Strategic thinking as a service, available when you need it most
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Feature 1 */}
            <div className="bg-white rounded-xl p-8 border border-gray-200 hover:border-strategy-primary/50 hover:shadow-lg transition-all duration-300">
              <div className="text-5xl mb-4">🎯</div>
              <h3 className="text-2xl font-display font-bold text-strategy-neutral-dark mb-3">
                Clear Decision Frameworks
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Cut through complexity with proven strategic frameworks. Get structured thinking that helps you see the path forward clearly and confidently.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-xl p-8 border border-gray-200 hover:border-strategy-primary/50 hover:shadow-lg transition-all duration-300">
              <div className="text-5xl mb-4">⚡</div>
              <h3 className="text-2xl font-display font-bold text-strategy-neutral-dark mb-3">
                Fast Strategic Clarity
              </h3>
              <p className="text-gray-600 leading-relaxed">
                No more weeks of deliberation. Have a focused conversation and walk away with clarity in minutes. Strategic thinking at the speed of business.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-xl p-8 border border-gray-200 hover:border-strategy-primary/50 hover:shadow-lg transition-all duration-300">
              <div className="text-5xl mb-4">🧠</div>
              <h3 className="text-2xl font-display font-bold text-strategy-neutral-dark mb-3">
                Expert Perspective
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Tap into battle-tested strategic thinking from experienced advisors. Get the outside perspective that helps you challenge assumptions and find better answers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-display font-bold text-strategy-neutral-dark mb-4">
              Your Strategic Thinking Session
            </h2>
            <p className="text-lg text-strategy-neutral max-w-2xl mx-auto">
              Three simple steps to strategic clarity
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto">
            {/* Step 1 */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-strategy-primary text-white text-2xl font-bold mb-6">
                01
              </div>
              <h3 className="text-2xl font-display font-bold text-strategy-neutral-dark mb-3">
                Choose Your Challenge
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Select from six strategic domains: pricing, growth, team, strategy, operations, or general business questions.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-strategy-primary text-white text-2xl font-bold mb-6">
                02
              </div>
              <h3 className="text-2xl font-display font-bold text-strategy-neutral-dark mb-3">
                Have a Conversation
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Engage in an interactive dialogue. Share your situation, answer thoughtful questions, and explore strategic frameworks together.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-strategy-primary text-white text-2xl font-bold mb-6">
                03
              </div>
              <h3 className="text-2xl font-display font-bold text-strategy-neutral-dark mb-3">
                Get Clarity
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Walk away with actionable insights, strategic frameworks, and the confidence to make better decisions for your business.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Strategic Domains Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-display font-bold text-strategy-neutral-dark mb-4">
              Strategic Domains We Cover
            </h2>
            <p className="text-lg text-strategy-neutral max-w-2xl mx-auto">
              Expert guidance across all critical business decisions
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {TOPICS.map((topic) => (
              <div 
                key={topic.id}
                className="bg-white rounded-xl p-6 border border-gray-200 hover:border-strategy-primary/50 hover:shadow-md transition-all duration-300"
              >
                <div className="text-4xl mb-3">{topic.emoji}</div>
                <h3 className="text-xl font-display font-bold text-strategy-neutral-dark mb-2">
                  {topic.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {topic.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-strategy-primary-light to-blue-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-display font-bold text-strategy-neutral-dark mb-6">
            Ready to Gain Strategic Clarity?
          </h2>
          <p className="text-xl text-strategy-neutral mb-8 max-w-2xl mx-auto">
            Join business leaders who've made better decisions through strategic conversation. Start your first session free.
          </p>
          <button
            onClick={onEnter}
            className="
              px-12 py-5
              bg-strategy-primary text-white
              text-xl font-display font-bold
              rounded-lg
              shadow-lg
              hover:bg-strategy-primary-dark
              hover:shadow-xl
              hover:scale-105
              transition-all duration-300
              focus:outline-none focus:ring-4 focus:ring-strategy-primary/50
              min-h-[44px] min-w-[44px] touch-manipulation
            "
          >
            Start Your Free Session
          </button>
          <div className="mt-6 text-sm text-gray-600">
            <span className="font-semibold">3 free conversations</span> • No credit card • Real strategic thinking
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <img 
                src="/strategy-shop-logo.png" 
                alt="The Strategy Shop" 
                className="h-10 w-10 object-contain"
              />
              <span className="text-lg font-display font-bold text-gray-300">
                The Strategy Shop
              </span>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <span>© 2025 The Strategy Shop</span>
              <span className="text-gray-600">•</span>
              <a href="#" className="hover:text-gray-300 transition-colors">Privacy Policy</a>
              <span className="text-gray-600">•</span>
              <a href="#" className="hover:text-gray-300 transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SplashScreen;
