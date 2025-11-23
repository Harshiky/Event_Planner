export interface TodoItem {
  id: string;
  task: string;
  estimatedCost: number; // in INR
  status: 'pending' | 'completed';
}

export interface EventPlan {
  eventType: string;
  description: string;
  steps: string[];
  todoList: TodoItem[];
  totalBudget: number; // in INR
  expandedDetails?: string; // Extra tips and details
}

export interface EventOption {
  id: string;
  title: string;
  icon: string; // Lucide icon name or image url
}
