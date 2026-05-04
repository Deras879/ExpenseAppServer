import { Router } from "express";
import jwt from "jsonwebtoken";
import {
  registerUser,
  loginUser,
} from "../controllers/users/users.controller.js";
const router = Router();

router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const user = await registerUser(username, email, password);
    res.status(201).json(user);
  } catch (error) {
    console.log(error.constraint);
    if (error.constraint === "unic email") {
      return res.status(400).json({ error: "Email already exists" });
    }
    res.status(500).json({ error: "Error registering user" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await loginUser(email, password);
    const refreshToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.status(200).json({ user, token, refreshToken });
  } catch (error) {
    if (
      error.message === "User not found" ||
      error.message === "Invalid password"
    ) {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: "Error logging in user" });
  }
});
export default router;
