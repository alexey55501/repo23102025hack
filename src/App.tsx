import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Landing } from './components/Landing';
import { AdminPanel } from './components/AdminPanel';
import { QuestChallenge } from './components/QuestChallenge';
import { WalletProvider } from './components/WalletProvider';
import { questStore } from './data/questStore';
import { Quest } from './types';

type Page = 'landing' | 'admin' | 'quest';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [quests, setQuests] = useState<Quest[]>([]);
  const [selectedQuestId, setSelectedQuestId] = useState<string | null>(null);

  useEffect(() => {
    loadQuests();
  }, []);

  const loadQuests = () => {
    setQuests(questStore.getQuests());
  };

  const handleStartQuest = (questId: string) => {
    setSelectedQuestId(questId);
    setCurrentPage('quest');
  };

  const handleBackToLanding = () => {
    setSelectedQuestId(null);
    setCurrentPage('landing');
    loadQuests();
  };

  const selectedQuest = selectedQuestId ? questStore.getQuest(selectedQuestId) : null;

  return (
    <WalletProvider>
      <div className="min-h-screen bg-gray-900">
        {currentPage !== 'quest' && (
          <Navbar onNavigate={setCurrentPage} currentPage={currentPage} />
        )}
        
        {currentPage === 'landing' && (
          <Landing quests={quests} onStartQuest={handleStartQuest} />
        )}
        
        {currentPage === 'admin' && (
          <AdminPanel quests={quests} onQuestsUpdate={loadQuests} />
        )}
        
        {currentPage === 'quest' && selectedQuest && (
          <QuestChallenge quest={selectedQuest} onBack={handleBackToLanding} />
        )}
      </div>
    </WalletProvider>
  );
}

export default App;
