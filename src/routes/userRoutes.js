import { Router } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import {
  registerUser,
  loginUser,
  getUserById,
  changePassword,
  getUserByEmail,
  updateUserProfile,
} from "../controllers/users/users.controller.js";
import authMiddleware from "../middlewares/authMiddleware.js";
const router = Router();

router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }
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
    console.log(user);
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

router.post("/change-password", authMiddleware, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.userId;
  try {
    const user = await getUserById(userId);
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password,
    );
    if (!isPasswordValid) {
      return res.status(400).json({ error: "Invalid password" });
    }

    await changePassword(userId, newPassword);
    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ error: "Error changing password" });
  }
});

router.put("/profile", authMiddleware, async (req, res) => {
  const userId = req.userId;
  const { username, email } = req.body;

  const fields = {};
  if (username) fields.username = username;
  if (email) fields.email = email;

  try {
    if (Object.keys(fields).length === 0) {
      return res.status(400).json({ error: "No fields to update" });
    }

    const user = await getUserById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (email) {
      const emailExists = await getUserByEmail(email);
      if (emailExists) {
        return res.status(400).json({ error: "Email already exists" });
      }
    }

    const updatedUser = await updateUserProfile(userId, fields);
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ error: "Error updating profile" });
  }
});
export default router;
