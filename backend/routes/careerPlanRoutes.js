
import express from "express";

import {
    saveCareerPlan,
    getCareerPlans,
    deleteCareerPlan,
    updateRoadmapStep
} from "../controllers/careerPlanController.js";

import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// Save Career Plan
router.post("/", protect, saveCareerPlan);

// Get Saved Career Plans
router.get("/", protect, getCareerPlans);

// Update Individual Roadmap Step
router.patch("/:id/roadmap/:stepIndex", protect, updateRoadmapStep);

// Delete Career Plan
router.delete("/:id", protect, deleteCareerPlan);

export default router;
