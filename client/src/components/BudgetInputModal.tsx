import React, { useState } from 'react';
import { X, IndianRupee } from 'lucide-react';

interface BudgetInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (budget: number) => void;
  eventType: string;
}

const BudgetInputModal: React.FC<BudgetInputModalProps> = ({ isOpen, onClose, onSubmit, eventType }) => {
  const [budget, setBudget] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const budgetValue = parseFloat(budget);
    if (budgetValue > 0) {
      onSubmit(budgetValue);
      setBudget('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200 border border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700">
          <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-100">Set Your Budget</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>
        
        <div className="p-6">
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            What is your estimated budget for the <span className="font-semibold text-blue-600 dark:text-blue-400">{eventType}</span>?
          </p>

          <form onSubmit={handleSubmit} className="relative">
            <div className="relative">
              <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
              <input
                type="number"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="e.g. 5000"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 outline-none transition-all placeholder-gray-400 dark:placeholder-gray-500"
                autoFocus
                min="1"
              />
            </div>
            
            <button 
              type="submit"
              disabled={!budget || parseFloat(budget) <= 0}
              className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Generate Plan
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BudgetInputModal;
