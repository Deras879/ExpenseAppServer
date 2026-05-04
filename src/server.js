import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import authMiddleware from "./middlewares/authMiddleware.js";
dotenv.config();
import userRoutes from "./routes/userRoutes.js";
import transactionsRoutes from "./routes/transactionsRoutes.js";

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/users", userRoutes);
app.use("/transactions", authMiddleware, transactionsRoutes);
export default app;
