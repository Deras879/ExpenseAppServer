import { Router } from "express";
const router = Router();

router.get("/refresh", async (req, res) => {
  const refreshToken = req.query.refreshToken;
  if (!refreshToken) {
    return res.status(400).json({ error: "Refresh token is required" });
  }

  const isExpired = refreshToken
    ? JSON.parse(atob(refreshToken.split(".")[1])).exp * 1000 < Date.now()
    : true;

  if (isExpired) {
    return res.status(401).json({ error: "Refresh token expired" });
  }
  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    const userId = decoded.userId;
    const newToken = jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.json({ token: newToken });
  } catch (error) {
    return res.status(401).json({ error: "Invalid refresh token" });
  }
});
export default router;
