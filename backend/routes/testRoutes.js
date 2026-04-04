import express from "express";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// Only Admin can access
router.get("/admin", protect, authorizeRoles("admin"), (req, res) => {
  res.json({ message: "Welcome Admin!" });
});

// Analyst + Admin
router.get("/analyst", protect, authorizeRoles("admin", "analyst"), (req, res) => {
  res.json({ message: "Welcome Analyst/Admin!" });
});

export default router;