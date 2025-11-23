import { Router } from "express";
import { generateEventPlan } from "../services/geminiService.js";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const { eventType, budget } = req.body;

    if (!eventType) {
      return res.status(400).json({
        ok: false,
        error: "Missing required field: eventType"
      });
    }

    const numericBudget = budget && Number(budget) > 0 ? Number(budget) : undefined;

    const plan = await generateEventPlan(eventType, numericBudget);

    res.status(200).json({
      ok: true,
      data: plan
    });

  } catch (error) {
    console.error("Route Error:", error);
    res.status(500).json({
      ok: false,
      error: error.message || "Internal Server Error"
    });
  }
});

export default router;
