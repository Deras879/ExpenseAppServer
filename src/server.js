import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import morgan from "morgan";
import authMiddleware from "./middlewares/authMiddleware.js";
import userRoutes from "./routes/userRoutes.js";
import transactionsRoutes from "./routes/transactionsRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import savingsGoalsRoutes from "./routes/savings_goalsRoutes.js";
import { pool } from "./db.js";

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/health", (req, res) => {
  pool.query("SELECT 1", (err, result) => {
    if (err) {
      console.error("Database connection error:", err);
      return res
        .status(500)
        .json({ status: "error", message: "Database connection failed" });
    }
    res.json({ status: "ok", message: "Server is healthy" });
  });
});

app.use("/users", userRoutes);
app.use("/transactions", authMiddleware, transactionsRoutes);
app.use("/auth", authRoutes);
app.use("/savings-goals", authMiddleware, savingsGoalsRoutes);
export default app;
