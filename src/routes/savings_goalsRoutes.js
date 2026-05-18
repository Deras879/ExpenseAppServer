import {
  getGoalContributions,
  createContribution,
} from "../controllers/savings_contributions/savings_contributions.controller.js";
import {
  getUserSavingGoals,
  createSavingGoal,
  updateSavingGoal,
  deleteSavingGoal,
  getSavingGoalById,
} from "../controllers/savings_goals/savings_goals.controller.js";
import { Router } from "express";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const userId = req.userId;
    const savingGoals = await getUserSavingGoals(userId);
    res.json(savingGoals);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const userId = req.userId;
    const { name, targetAmount, deadline, icon, color } = req.body;
    const newGoal = await createSavingGoal(
      userId,
      name,
      targetAmount,
      0,
      deadline,
      icon,
      color,
    );
    res.status(201).json(newGoal);
  } catch (error) {
    console.log(error);

    res.status(500).json({ error });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const userId = req.userId;
    const goalId = req.params.id;
    // Solo se actualizan los campos presentes en el body
    const { name, targetAmount, deadline, icon, color, status } = req.body;

    console.log(req.body);

    const updatedGoal = await updateSavingGoal(goalId, userId, {
      name,
      targetAmount,
      deadline,
      icon,
      color,
      status,
    });
    res.json(updatedGoal);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const userId = req.userId;
    const goalId = req.params.id;
    await deleteSavingGoal(goalId, userId);
    res.status(200).json({ message: "Saving goal deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const userId = req.userId;
    const goalId = req.params.id;
    const savingGoal = await getSavingGoalById(goalId, userId);
    res.json(savingGoal);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:id/contributions", async (req, res) => {
  try {
    const userId = req.userId;
    const goalId = req.params.id;

    const contributions = await getGoalContributions(goalId);

    res.json(contributions);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/:id/contributions", async (req, res) => {
  try {
    const userId = req.userId;
    const goalId = req.params.id;
    const { amount, note } = req.body;

    const contribution = await createContribution(goalId, amount, note, userId);
    const savingGoal = await getSavingGoalById(goalId, userId);

    if (
      Number(savingGoal.current_amount) + Number(amount) >=
      Number(savingGoal.target_amount)
    ) {
      // Si la contribución completa la meta, la marcamos como "completed"
      await updateSavingGoal(goalId, userId, {
        status: "completed",
      });
    }
    // Solo actualizamos current_amount (delta: positivo suma, negativo resta)
    await updateSavingGoal(goalId, userId, { currentAmount: amount });

    res.status(201).json(contribution);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
