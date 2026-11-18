
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import careerPlanRoutes from "./routes/careerPlanRoutes.js";
import careerRoutes from "./routes/careerRoutes.js";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
dotenv.config();

const app = express();

app.use(cors({
    origin: "http://localhost:5173"
}));

app.use(express.json());

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/career-plans", careerPlanRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/career", careerRoutes);
app.use("/api/jobs", jobRoutes);
// Home Route
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "CareerForgeAI Backend is running!"
    });
});

// Health Check
app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        status: "Healthy",
        project: "CareerForgeAI"
    });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    await connectDB();

    app.listen(PORT, () => {
        console.log(`CareerForgeAI Server running on port ${PORT}`);
    });
};

startServer();
