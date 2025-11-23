import axios from "axios";
import { EventPlan } from "../types/event";

const API = "http://localhost:5000/api/generate";

interface ApiResponse {
  ok: boolean;
  data?: EventPlan;
  error?: string;
}

export async function generateAIEventPlan(eventType: string, userBudget?: number): Promise<EventPlan> {
  try {
    const res = await axios.post<ApiResponse>(API, { eventType, budget: userBudget });

    if (!res.data.ok) {
      throw new Error(res.data.error || "API Error");
    }

    // Ensure totalBudget exists for TypeScript compliance
    const plan = res.data.data!;
    if (plan.totalBudget === undefined) {
      plan.totalBudget = plan.todoList.reduce((sum, t) => sum + t.estimatedCost, 0);
    }

    return plan;
  } catch (err: any) {
    console.error("generateAIEventPlan error:", err);
    throw new Error(err.message || "Failed to fetch event plan");
  }
}
