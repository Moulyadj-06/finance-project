import express from "express";
import { createRecord, getRecords, deleteRecord } from "../controllers/recordController.js";
import { protect } from "../middleware/authMiddleware.js";
import { getAnalytics } from "../controllers/recordController.js";
import { getCategoryAnalytics } from "../controllers/recordController.js";
import { getMonthlyAnalytics } from "../controllers/recordController.js";
import { updateRecord } from "../controllers/recordController.js";
import { getRecentRecords } from "../controllers/recordController.js";
import { adminOnly, analystOnly } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/", protect, adminOnly, createRecord);
router.get("/", protect, getRecords);
router.delete("/:id", protect, deleteRecord);
router.get("/analytics", protect, analystOnly, getAnalytics);
router.get("/analytics/category", protect, getCategoryAnalytics);
router.get("/analytics/monthly", protect, getMonthlyAnalytics);
router.put("/:id", protect, updateRecord);
router.get("/recent", protect, getRecentRecords);



export default router;