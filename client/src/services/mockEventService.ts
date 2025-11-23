import { EventPlan } from '../types/event';

// Mock service simulating AI-generated event plan
export const generateEventPlan = async (eventType: string): Promise<EventPlan> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const basePlan: EventPlan = {
    eventType,
    description: `A complete guide to organizing a successful ${eventType}.`,
    steps: [
      "Define the guest list and send invitations.",
      "Select a venue and date.",
      "Plan the menu and order food/drinks.",
      "Arrange entertainment and decorations.",
      "Finalize the schedule and confirm vendors."
    ],
    expandedDetails: "Tips: Check for vendor discounts and book early to avoid last-minute issues.",
    todoList: [
      { id: '1', task: 'Book Venue', estimatedCost: 5000, status: 'pending' },
      { id: '2', task: 'Order Cake', estimatedCost: 1500, status: 'pending' },
      { id: '3', task: 'Buy Decorations', estimatedCost: 2000, status: 'pending' },
      { id: '4', task: 'Arrange Music/DJ', estimatedCost: 3000, status: 'pending' },
      { id: '5', task: 'Send Invites', estimatedCost: 500, status: 'pending' }
    ],
    totalBudget: 12000
  };

  // Customize slightly based on input to show dynamic behavior
  if (eventType.toLowerCase().includes('birthday')) {
    basePlan.steps.unshift("Choose a birthday theme.");
    basePlan.todoList.push({ id: '6', task: 'Buy Return Gifts', estimatedCost: 2000, status: 'pending' });
    basePlan.totalBudget += 2000;
  } else if (eventType.toLowerCase().includes('school')) {
    basePlan.steps.unshift("Get permission from school principal.");
    basePlan.todoList.push({ id: '6', task: 'Print ID badges', estimatedCost: 1000, status: 'pending' });
    basePlan.totalBudget += 1000;
  }

  return basePlan;
};
