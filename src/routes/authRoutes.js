import { Router } from "express";
import jwt from "jsonwebtoken";
const router = Router();

router.post("/refresh", async (req, res) => {
  const refreshToken = req.body.refreshToken;
  if (!refreshToken) {
    return res.status(400).json({ error: "Refresh token is required" });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    const userId = decoded.userId;
    const newToken = jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.json({ token: newToken });
  } catch (error) {
    console.log(error);
    return res.status(401).json({ error: "Invalid refresh token" });
  }
});
export default router;
