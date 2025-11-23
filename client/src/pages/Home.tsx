import React, { useState } from 'react';
import { Cake, GraduationCap, PartyPopper, Search, Music, Briefcase } from 'lucide-react';
import EventCard from '../components/EventCard';
import SearchModal from '../components/SearchModal';

interface HomeProps {
  onEventSelect: (eventType: string) => void;
}

const Home: React.FC<HomeProps> = ({ onEventSelect }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const commonEvents = [
    { title: 'Birthday Party', icon: Cake, id: 'birthday' },
    { title: 'School Party', icon: Briefcase, id: 'school' },
    { title: 'College Party', icon: GraduationCap, id: 'college' },
    { title: 'Music Festival', icon: Music, id: 'music' },
    { title: 'New Year', icon: PartyPopper, id: 'newyear' },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="max-w-4xl w-full space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white tracking-tight">
            AI Event Planner
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Select an event type or search for anything. Our AI will generate a complete plan, budget, and to-do list for you.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {commonEvents.map((event) => (
            <EventCard
              key={event.id}
              title={event.title}
              Icon={event.icon}
              onClick={() => onEventSelect(event.title)}
            />
          ))}
          
          <EventCard
            title="Other Event"
            Icon={Search}
            onClick={() => setIsSearchOpen(true)}
            color="bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800"
          />
        </div>
      </div>

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelect={(type) => {
          setIsSearchOpen(false);
          onEventSelect(type);
        }}
      />
    </div>
  );
};

export default Home;
