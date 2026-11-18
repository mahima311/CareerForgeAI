
import express from "express";
import {
    getProfile,
    updateProfile
} from "../controllers/profileController.js";

import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// Get user profile
router.get("/", protect, getProfile);

// Update user profile
router.put("/", protect, updateProfile);

export default router;
