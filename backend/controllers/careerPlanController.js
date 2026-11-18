
import mongoose from "mongoose";
import CareerPlan from "../models/CareerPlan.js";

// Calculate roadmap progress
const getPlanProgress = (plan) => {
    const roadmap = plan.learningRoadmap || [];
    const totalSteps = roadmap.length;

    const completedSteps = roadmap.filter(
        (step) => step.completed === true
    ).length;

    const progress = totalSteps > 0
        ? Math.round((completedSteps / totalSteps) * 100)
        : 0;

    return {
        totalSteps,
        completedSteps,
        progress
    };
};

// Save Career Plan
export const saveCareerPlan = async (req, res) => {
    try {
        const {
            careerTitle,
            matchScore,
            description,
            whyMatch,
            skillsToLearn,
            learningRoadmap,
            suggestedProjects
        } = req.body;

        if (!careerTitle) {
            return res.status(400).json({
                success: false,
                message: "Career title is required"
            });
        }

        const existingPlan = await CareerPlan.findOne({
            user: req.user._id,
            careerTitle
        });

        if (existingPlan) {
            return res.status(409).json({
                success: false,
                message: "This career plan is already saved"
            });
        }

        const careerPlan = await CareerPlan.create({
            user: req.user._id,
            careerTitle,
            matchScore,
            description,
            whyMatch,
            skillsToLearn,
            learningRoadmap,
            suggestedProjects
        });

        res.status(201).json({
            success: true,
            message: "Career plan saved successfully",
            careerPlan,
            ...getPlanProgress(careerPlan)
        });

    } catch (error) {
        console.error("Save Career Plan Error:", error);

        res.status(500).json({
            success: false,
            message: "Unable to save career plan"
        });
    }
};

// Get User's Saved Career Plans
export const getCareerPlans = async (req, res) => {
    try {
        const careerPlans = await CareerPlan.find({
            user: req.user._id
        }).sort({ createdAt: -1 });

        const plansWithProgress = careerPlans.map((plan) => ({
            ...plan.toObject(),
            ...getPlanProgress(plan)
        }));

        res.status(200).json({
            success: true,
            count: careerPlans.length,
            careerPlans: plansWithProgress
        });

    } catch (error) {
        console.error("Get Career Plans Error:", error);

        res.status(500).json({
            success: false,
            message: "Unable to fetch career plans"
        });
    }
};

// Update Individual Roadmap Step
export const updateRoadmapStep = async (req, res) => {
    try {
        const { id, stepIndex } = req.params;
        const { completed } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid career plan ID"
            });
        }

        if (
            !Number.isInteger(Number(stepIndex)) ||
            Number(stepIndex) < 0
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid roadmap step index"
            });
        }

        if (typeof completed !== "boolean") {
            return res.status(400).json({
                success: false,
                message: "Completed must be true or false"
            });
        }

        const careerPlan = await CareerPlan.findOne({
            _id: id,
            user: req.user._id
        });

        if (!careerPlan) {
            return res.status(404).json({
                success: false,
                message: "Career plan not found"
            });
        }

        const index = Number(stepIndex);

        if (index >= careerPlan.learningRoadmap.length) {
            return res.status(404).json({
                success: false,
                message: "Roadmap step not found"
            });
        }

        careerPlan.learningRoadmap[index].completed = completed;

        const totalSteps = careerPlan.learningRoadmap.length;
        const completedSteps = careerPlan.learningRoadmap.filter(
            (step) => step.completed === true
        ).length;

        careerPlan.completed =
            totalSteps > 0 && completedSteps === totalSteps;

        await careerPlan.save();

        res.status(200).json({
            success: true,
            message: "Roadmap progress updated successfully",
            careerPlan,
            ...getPlanProgress(careerPlan)
        });

    } catch (error) {
        console.error("Update Roadmap Step Error:", error);

        res.status(500).json({
            success: false,
            message: "Unable to update roadmap progress"
        });
    }
};

// Delete Career Plan
export const deleteCareerPlan = async (req, res) => {
    try {
        const careerPlan = await CareerPlan.findOneAndDelete({
            _id: req.params.id,
            user: req.user._id
        });

        if (!careerPlan) {
            return res.status(404).json({
                success: false,
                message: "Career plan not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Career plan deleted successfully"
        });

    } catch (error) {
        console.error("Delete Career Plan Error:", error);

        res.status(500).json({
            success: false,
            message: "Unable to delete career plan"
        });
    }
};
