import { Router } from "express";
const router = Router();
import {
  createTransaction,
  getUserTransactions,
  getMetrics,
  getExpensesByCategory,
  getExpensesVsIncomeSixMonth,
  getLast7DaysExpenses,
} from "../controllers/transactions/transactions.controller.js";

router.get("/", async (req, res) => {
  const userId = req.userId;
  const { page = 1, limit = 10, title, category } = req.query;
  try {
    const result = await getUserTransactions(userId, {
      page,
      limit,
      title,
      category,
    });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
});

router.post("/", async (req, res) => {
  const { amount, type, description, category, date } = req.body;
  const userId = req.userId;
  try {
    const transaction = await createTransaction(
      userId,
      amount,
      type,
      description,
      category,
      date,
    );
    res.status(201).json(transaction);
  } catch (error) {
    res
      .status(500)
      .json({ error: error.message || "Failed to create transaction" });
  }
});

router.get("/metrics", async (req, res) => {
  const userId = req.userId;
  try {
    const metrics = await getMetrics(userId);
    res.json(metrics);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch metrics" });
  }
});

router.get("/expenses-by-category", async (req, res) => {
  const userId = req.userId;
  try {
    const expensesByCategory = await getExpensesByCategory(userId);
    const expensesVsIncome = await getExpensesVsIncomeSixMonth(userId);
    const last7DaysExpenses = await getLast7DaysExpenses(userId);
    res.json({ expensesByCategory, expensesVsIncome, last7DaysExpenses });
  } catch (error) {
    console.log(error);

    res.status(500).json({ error: "Failed to fetch expenses by category" });
  }
});

export default router;
