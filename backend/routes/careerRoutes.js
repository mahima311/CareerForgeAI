
import express from "express";

import {
    recommendCareers,
    evaluateInterviewAnswer
} from "../controllers/careerController.js";

import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// Generate career recommendations
router.post("/recommend", protect, recommendCareers);

// AI Interview Answer Evaluation
router.post("/evaluate-interview", protect, evaluateInterviewAnswer);

export default router;
