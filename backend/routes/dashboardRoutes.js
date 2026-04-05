
import express from "express";
import User from "../models/User.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// Get all analysts and viewers — admin only
router.get(
  "/users",
  protect,               // ensures user is logged in
  authorizeRoles("admin"), // ensures only admin can access
  async (req, res) => {
    try {
      const users = await User.find({ role: { $in: ["analyst", "viewer"] } }).select("-password");
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

export default router;