// backend/services/geminiService.js
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

// Initialize API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// Schema Definition: Enforces the AI to return this exact JSON structure
const eventPlanSchema = {
  type: SchemaType.OBJECT,
  properties: {
    eventType: { type: SchemaType.STRING },
    description: { type: SchemaType.STRING },
    steps: {
      type: SchemaType.ARRAY,
      items: { type: SchemaType.STRING },
    },
    todoList: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          id: { type: SchemaType.STRING },
          task: { type: SchemaType.STRING },
          estimatedCost: { type: SchemaType.NUMBER },
          status: { type: SchemaType.STRING },
        },
        required: ["id", "task", "estimatedCost", "status"],
      },
    },
    totalBudget: { type: SchemaType.NUMBER },
    expandedDetails: { type: SchemaType.STRING, nullable: true },
  },
  required: ["eventType", "description", "steps", "todoList", "totalBudget"],
};

export async function generateEventPlan(eventType, budget) {
  // Dynamically import mock service for fallback
  const { generateEventPlan: mockPlan } = await import("./mockEventService.js");

  const model = genAI.getGenerativeModel({
    model: "models/gemini-flash-latest",
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: eventPlanSchema,
    },
  });

  const prompt = `
    You are an expert event planner. Create a detailed event plan for a "${eventType}".
    ${budget ? `The user has a budget of ₹${budget}.` : "Estimate a reasonable budget in INR."}
    
    Requirements:
    - Generate 5-7 specific, chronological steps.
    - Create a checklist of 5-8 items with realistic costs.
    - Ensure 'totalBudget' is the sum of checklist items.
    - 'status' must be 'pending'.
    - 'expandedDetails': Provide a paragraph of extra tips, theme ideas, or logistic advice.
  `;

  try {
    const result = await model.generateContent(prompt);

    // Safely parse JSON
    try {
      return JSON.parse(result.response.text());
    } catch (err) {
      console.error("AI returned invalid JSON. Falling back to mock plan.", err);
      return mockPlan(eventType);
    }
  } catch (err) {
    console.error("AI Generation failed. Falling back to mock plan.", err);
    return mockPlan(eventType);
  }
}
