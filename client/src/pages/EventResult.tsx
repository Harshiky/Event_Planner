import React, { useEffect, useState } from 'react';
import { 
  ArrowLeft, CheckCircle2, Circle, Loader2, IndianRupee, List, CalendarCheck, Plus, ChevronDown, ChevronUp, Trash2 
} from 'lucide-react';
import { EventPlan, TodoItem } from '../types/event';
import { generateAIEventPlan } from '../services/aiEventService';

interface EventResultProps {
  eventType: string;
  userBudget?: number;
  onBack: () => void;
}

const EventResult: React.FC<EventResultProps> = ({ eventType, userBudget, onBack }) => {
  const [plan, setPlan] = useState<EventPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [extraBudget, setExtraBudget] = useState<string>(''); // Additional budget input
  const [newTodoTask, setNewTodoTask] = useState('');
  const [newTodoCost, setNewTodoCost] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
  const fetchPlan = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await generateAIEventPlan(eventType, userBudget);

      // Ensure totalBudget exists
      const totalBudget = (data.todoList || []).reduce(
        (sum: number, t: TodoItem) => sum + t.estimatedCost,
        0
      );

      setPlan({
        eventType: data.eventType || eventType,
        description: data.description || '',
        steps: data.steps || [],
        expandedDetails: data.expandedDetails || '',
        todoList: data.todoList || [],
        totalBudget
      });
    } catch (error: any) {
      console.error("Failed to generate plan", error);
      setError(error.message || "Failed to generate plan. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  fetchPlan();
}, [eventType, userBudget]);


  const handleAddTodo = () => {
    if (!plan || !newTodoTask.trim()) return;

    const cost = parseFloat(newTodoCost) || 0;
    const newTodo: TodoItem = {
      id: `custom-${Date.now()}`,
      task: newTodoTask,
      estimatedCost: cost,
      status: 'pending'
    };

    setPlan({
      ...plan,
      todoList: [...plan.todoList, newTodo]
    });

    setNewTodoTask('');
    setNewTodoCost('');
  };

  const handleDeleteTodo = (id: string) => {
    if (!plan) return;
    setPlan({
      ...plan,
      todoList: plan.todoList.filter(t => t.id !== id)
    });
  };

  const toggleTodoStatus = (id: string) => {
    if (!plan) return;
    setPlan({
      ...plan,
      todoList: plan.todoList.map(t => 
        t.id === id ? { ...t, status: t.status === 'completed' ? 'pending' : 'completed' } : t
      )
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 space-y-4">
        <Loader2 className="w-12 h-12 text-blue-600 dark:text-blue-400 animate-spin" />
        <p className="text-gray-600 dark:text-gray-300 font-medium animate-pulse">
          Generating your plan for <span className="font-bold text-blue-600 dark:text-blue-400">{eventType}</span>
          {userBudget !== undefined && <span> with budget <span className="font-bold text-green-600 dark:text-green-400">₹{userBudget}</span></span>}...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 space-y-4">
        <div className="text-red-500 dark:text-red-400 font-medium text-center">
          <p className="text-lg mb-2">Oops! Something went wrong.</p>
          <p className="text-sm opacity-80">{error}</p>
        </div>
        <button 
          onClick={onBack}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!plan) return null;

  const totalBaseCost = plan.todoList.reduce((acc, item) => acc + item.estimatedCost, 0);
  const additionalBudget = isNaN(parseFloat(extraBudget)) ? 0 : parseFloat(extraBudget);
  const finalTotal = totalBaseCost + additionalBudget;

  return (
    <div className="min-h-screen p-4 md:p-8 lg:p-12 pb-24">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={onBack}
              className="p-2 hover:bg-white dark:hover:bg-gray-800 rounded-full transition-colors border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
            >
              <ArrowLeft className="w-6 h-6 text-gray-600 dark:text-gray-300" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{plan.eventType}</h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base max-w-2xl">{plan.description}</p>
            </div>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 px-4 py-2 rounded-xl border border-green-100 dark:border-green-800">
            <p className="text-xs text-green-600 dark:text-green-400 font-medium uppercase tracking-wider">Total Budget</p>
            <p className="text-2xl font-bold text-green-700 dark:text-green-300">₹{finalTotal.toLocaleString('en-IN')}</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">

            {/* Steps */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                  <CalendarCheck className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Step-by-Step Guide</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {plan.steps.map((step, index) => (
                  <div key={index} className="flex gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-700/30 border border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-800 transition-colors">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 flex items-center justify-center font-bold text-sm shadow-sm">
                      {index + 1}
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{step}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Expanded Details */}
            {plan.expandedDetails && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                <button 
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="w-full flex items-center justify-between p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-50 dark:bg-amber-900/30 rounded-lg">
                      <Loader2 className="w-6 h-6 text-amber-600 dark:text-amber-400" /> 
                    </div>
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Tips & Hacks</h2>
                  </div>
                  {isExpanded ? <ChevronUp className="text-gray-400" /> : <ChevronDown className="text-gray-400" />}
                </button>
                
                {isExpanded && (
                  <div className="px-6 pb-6 pt-0 animate-in slide-in-from-top-2 duration-200">
                    <div className="p-4 bg-amber-50 dark:bg-amber-900/10 rounded-xl border border-amber-100 dark:border-amber-800/30">
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                        {plan.expandedDetails}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>

          {/* Right Column */}
          <div className="space-y-6">

            {/* Budget */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-green-50 dark:bg-green-900/30 rounded-lg">
                  <IndianRupee className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Budget Manager</h2>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Base Estimate</span>
                  <span className="font-medium text-gray-900 dark:text-gray-200">₹{totalBaseCost.toLocaleString('en-IN')}</span>
                </div>
                
                {userBudget !== undefined && (
                  <div className="flex justify-between text-sm pb-2 border-b border-gray-100 dark:border-gray-700">
                    <span className="text-gray-500 dark:text-gray-400">Target Budget</span>
                    <span className="font-medium text-blue-600 dark:text-blue-400">₹{userBudget.toLocaleString('en-IN')}</span>
                  </div>
                )}

                <div className="space-y-2 pt-2">
                  <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Add Extra Budget</label>
                  <div className="relative">
                    <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                      type="number" 
                      value={extraBudget}
                      onChange={(e) => setExtraBudget(e.target.value)}
                      placeholder="0"
                      className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
                  <span className="font-semibold text-gray-700 dark:text-gray-300">Total</span>
                  <span className="text-xl font-bold text-green-600 dark:text-green-400">₹{finalTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            {/* Todo List */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
                  <List className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">To-Do List</h2>
              </div>

              {/* Add New Todo */}
              <div className="flex gap-2 mb-4">
                <input 
                  type="text" 
                  value={newTodoTask}
                  onChange={(e) => setNewTodoTask(e.target.value)}
                  placeholder="Add item..."
                  className="flex-1 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none"
                />
                <input 
                  type="number" 
                  value={newTodoCost}
                  onChange={(e) => setNewTodoCost(e.target.value)}
                  placeholder="₹"
                  className="w-20 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none"
                />
                <button 
                  onClick={handleAddTodo}
                  disabled={!newTodoTask.trim()}
                  className="p-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg disabled:opacity-50 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {plan.todoList.map((todo) => (
                  <div key={todo.id} className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-xl transition-colors border border-gray-100 dark:border-gray-700 group">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <button 
                        onClick={() => toggleTodoStatus(todo.id)}
                        className="text-gray-400 dark:text-gray-500 hover:text-purple-600 dark:hover:text-purple-400 transition-colors flex-shrink-0"
                      >
                        {todo.status === 'completed' ? (
                          <CheckCircle2 className="w-5 h-5 text-green-500" />
                        ) : (
                          <Circle className="w-5 h-5" />
                        )}
                      </button>
                      <span className={`truncate text-sm ${todo.status === 'completed' ? 'line-through text-gray-400 dark:text-gray-500' : 'text-gray-700 dark:text-gray-300'}`}>
                        {todo.task}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-md">
                        ₹{todo.estimatedCost.toLocaleString('en-IN')}
                      </span>
                      <button 
                        onClick={() => handleDeleteTodo(todo.id)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-red-400 hover:text-red-600 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventResult;
