
import mongoose from "mongoose";

// Individual roadmap step schema
const roadmapStepSchema = new mongoose.Schema(
    {
        step: {
            type: mongoose.Schema.Types.Mixed
        },
        title: {
            type: String,
            default: ""
        },
        description: {
            type: String,
            default: ""
        },
        completed: {
            type: Boolean,
            default: false
        }
    },
    {
        _id: false
    }
);

const careerPlanSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        careerTitle: {
            type: String,
            required: true,
            trim: true
        },

        matchScore: {
            type: Number,
            default: 0
        },

        description: {
            type: String,
            default: ""
        },

        whyMatch: {
            type: String,
            default: ""
        },

        skillsToLearn: {
            type: [String],
            default: []
        },

        learningRoadmap: {
            type: [roadmapStepSchema],
            default: []
        },

        suggestedProjects: {
            type: [String],
            default: []
        },

        completed: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

const CareerPlan = mongoose.models.CareerPlan ||
    mongoose.model("CareerPlan", careerPlanSchema);

export default CareerPlan;
