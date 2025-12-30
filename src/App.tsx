import { useState, useEffect } from 'react';
import type { Topic, ConversationSession } from './types';
import SplashScreen from './components/SplashScreen';
import MainHub from './components/MainHub';
import AppHeader from './components/AppHeader';
import StrategySession from './components/StrategySession';

type AppView = 'splash' | 'hub' | 'session';

function App() {
  const [currentView, setCurrentView] = useState<AppView>('splash');
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);

  useEffect(() => {
    // Check if splash has been shown before
    const hasSeenSplash = localStorage.getItem('strategy-shop-has-seen-splash') === 'true';
    if (hasSeenSplash) {
      setCurrentView('hub');
    }
  }, []);

  const handleEnterFromSplash = () => {
    localStorage.setItem('strategy-shop-has-seen-splash', 'true');
    setCurrentView('hub');
  };

  const handleSelectTopic = (topic: Topic) => {
    setSelectedTopic(topic);
    setCurrentView('session');
  };

  const handleSelectRecentSession = (session: ConversationSession) => {
    setSelectedTopic(session.topic);
    setCurrentView('session');
  };

  const handleGoHome = () => {
    setSelectedTopic(null);
    setCurrentView('hub');
  };

  const handleChangeTopic = () => {
    setSelectedTopic(null);
    setCurrentView('hub');
  };

  return (
    <div className="App">
      {currentView === 'splash' && (
        <SplashScreen onEnter={handleEnterFromSplash} />
      )}
      
      {currentView === 'hub' && (
        <>
          <AppHeader onHomeClick={handleGoHome} showHomeButton={false} />
          <MainHub
            onSelectTopic={handleSelectTopic}
            onSelectRecentSession={handleSelectRecentSession}
          />
        </>
      )}
      
      {currentView === 'session' && selectedTopic && (
        <>
          <AppHeader onHomeClick={handleGoHome} showHomeButton={true} />
          <StrategySession
            topic={selectedTopic}
            onChangeTopic={handleChangeTopic}
          />
        </>
      )}
    </div>
  );
}

export default App;
