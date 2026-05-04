import { Router } from "express";
const router = Router();
import {
  createTransaction,
  getUserTransactions,
} from "../controllers/transactions/transactions.controller.js";

router.get("/", async (req, res) => {
  const userId = req.userId;
  try {
    const transactions = await getUserTransactions(userId);
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
});

router.post("/", async (req, res) => {
  const { amount, type, title, category } = req.body;
  const userId = req.userId;
  try {
    const transaction = await createTransaction(
      userId,
      amount,
      type,
      title,
      category,
    );
    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ error: "Failed to create transaction" });
  }
});

export default router;
