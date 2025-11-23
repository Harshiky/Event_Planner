import { useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import Home from './pages/Home';
import EventResult from './pages/EventResult';
import BudgetInputModal from './components/BudgetInputModal';
import { useTheme } from './hooks/useTheme';

function App() {
  // Simple state-based routing for this phase
  // In a full MERN app, we would use react-router-dom
  
  // TODO: Enable Youware Backend for user authentication and data persistence.
  // Refer to /skills/backend-integration/SKILL.md for setup.
  // Use 'mcp-marketplace:yw_backend' to enable the tool.

  const [currentView, setCurrentView] = useState<'home' | 'result'>('home');
  const [selectedEvent, setSelectedEvent] = useState<string>('');
  const [userBudget, setUserBudget] = useState<number | undefined>(undefined);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const handleEventSelect = (eventType: string) => {
    setSelectedEvent(eventType);
    setIsBudgetModalOpen(true);
  };

  const handleBudgetSubmit = (budget: number) => {
    setUserBudget(budget);
    setIsBudgetModalOpen(false);
    setCurrentView('result');
  };

  const handleBack = () => {
    setCurrentView('home');
    setSelectedEvent('');
    setUserBudget(undefined);
  };

  return (
    <div className="font-sans text-gray-900 dark:text-gray-100 min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="absolute top-4 right-4 z-50">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-all border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300"
          aria-label="Toggle theme"
        >
          {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
        </button>
      </div>

      {currentView === 'home' ? (
        <Home onEventSelect={handleEventSelect} />
      ) : (
        <EventResult 
          eventType={selectedEvent} 
          userBudget={userBudget} 
          onBack={handleBack} 
        />
      )}

      <BudgetInputModal
        isOpen={isBudgetModalOpen}
        onClose={() => setIsBudgetModalOpen(false)}
        onSubmit={handleBudgetSubmit}
        eventType={selectedEvent}
      />
    </div>
  );
}

export default App;
