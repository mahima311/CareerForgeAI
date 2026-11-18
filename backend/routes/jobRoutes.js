
import express from "express";
import { getJobs } from "../controllers/jobController.js";

const router = express.Router();

// Get live job listings
router.get("/", getJobs);

export default router;
