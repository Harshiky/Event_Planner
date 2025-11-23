import React from 'react';
import { LucideIcon } from 'lucide-react';

interface EventCardProps {
  title: string;
  Icon: LucideIcon;
  onClick: () => void;
  color?: string;
}

const EventCard: React.FC<EventCardProps> = ({ title, Icon, onClick, color = "bg-white dark:bg-gray-800" }) => {
  // Adjust color prop handling if it's specific classes, but default is white/dark-gray
  const baseClasses = "p-6 rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer border border-gray-100 dark:border-gray-700 flex flex-col items-center justify-center gap-4 aspect-square group";
  const bgClass = color.includes('bg-') ? color : `${color} dark:bg-gray-800`;

  return (
    <div 
      onClick={onClick}
      className={`${bgClass} ${baseClasses}`}
    >
      <div className="p-4 rounded-full bg-gray-50 dark:bg-gray-700 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30 transition-colors">
        <Icon className="w-8 h-8 text-gray-600 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
      </div>
      <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-center group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">{title}</h3>
    </div>
  );
};

export default EventCard;
