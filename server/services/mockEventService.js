// server/services/mockEventService.js
export const generateEventPlan = async (eventType) => {
  return {
    eventType,
    description: `Mock plan for ${eventType}`,
    steps: ["Step 1", "Step 2", "Step 3"],
    todoList: [
      { id: "1", task: "Mock Task 1", estimatedCost: 1000, status: "pending" },
    ],
    totalBudget: 1000,
    expandedDetails: "Some extra tips here."
  };
};
