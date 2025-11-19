import express from "express";
import User from "../models/user.js";
import { authenticateToken } from "../middlewares/auth.js";

const router = express.Router();

// GET all employees (admin only)
router.get("/info", authenticateToken, async (req, res) => {
  try {
    // Check if user is admin
    if (!Array.isArray(req.user.roles) || !req.user.roles.includes("admin")) {
      return res.status(403).json({ error: "Forbidden - Admin access required" });
    }

    const employees = await User.find({ roles: "employee" }).select(
      "name email lastLogin roles"
    );

    res.json({ employees });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch employees" });
  }
});

export default router;
