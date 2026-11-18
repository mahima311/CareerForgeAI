
import { GoogleGenAI } from "@google/genai";

const MODEL_NAME = "gemini-3.5-flash-lite";

// Convert skills and interests into clean arrays
const convertToList = (value) => {
    if (Array.isArray(value)) {
        return value
            .map((item) => String(item).trim())
            .filter(Boolean)
            .slice(0, 30);
    }

    if (typeof value === "string") {
        return value
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean)
            .slice(0, 30);
    }

    return [];
};

// Generate AI-based career recommendations
export const recommendCareers = async (req, res) => {
    try {
        // Check Gemini API key
        if (!process.env.GEMINI_API_KEY) {
            throw new Error("Gemini API key is missing.");
        }

        // Initialize Gemini inside the request handler
        const ai = new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY
        });

        const { qualification, skills, interests } = req.body;

        // Validate input
        if (
            !qualification ||
            typeof qualification !== "string" ||
            !skills ||
            !interests
        ) {
            return res.status(400).json({
                success: false,
                message: "Please provide qualification, skills and interests."
            });
        }

        const userSkills = convertToList(skills);
        const userInterests = convertToList(interests);

        if (!userSkills.length || !userInterests.length) {
            return res.status(400).json({
                success: false,
                message: "Please provide at least one skill and one interest."
            });
        }

        // Prepare student profile
        const userData = {
            qualification: qualification.trim().slice(0, 200),
            skills: userSkills,
            interests: userInterests
        };

        // Gemini AI prompt
        const prompt = `
You are an expert AI career counselor helping students and fresh graduates.

Analyze the following student profile and generate personalized career recommendations.

STUDENT PROFILE:
${JSON.stringify(userData, null, 2)}

YOUR TASK:

1. Recommend the 3 to 5 most suitable career paths.
2. Consider the student's qualification, skills and interests.
3. Give realistic recommendations suitable for freshers.
4. Explain why each career matches the student.
5. Identify the skills the student should learn next.
6. Provide a practical step-by-step learning roadmap.
7. Include relevant beginner-friendly project suggestions where appropriate.
8. Do not assume the student has experience or skills that are not listed.
9. Match scores must be realistic percentages between 0 and 100.
10. Keep explanations clear, practical and student-friendly.

Return ONLY valid JSON in this exact structure:

{
    "recommendations": [
        {
            "title": "Career title",
            "description": "Short explanation of this career",
            "matchScore": 85,
            "whyMatch": "Why this career suits the student",
            "skillsToLearn": [
                "Skill 1",
                "Skill 2",
                "Skill 3"
            ],
            "learningRoadmap": [
                {
                    "step": 1,
                    "title": "Learning step",
                    "description": "What the student should learn"
                }
            ],
            "suggestedProjects": [
                "Project idea 1",
                "Project idea 2"
            ]
        }
    ]
}

Return between 3 and 5 recommendations.
Do not include Markdown code fences or text outside JSON.
`;

        // Generate response using Gemini
        const response = await ai.models.generateContent({
            model: MODEL_NAME,
            contents: prompt,
            config: {
                temperature: 0.4,
                responseMimeType: "application/json"
            }
        });

        const responseText = response.text;

        if (!responseText) {
            throw new Error("Gemini returned an empty response.");
        }

        // Parse AI response
        const aiResult = JSON.parse(responseText);

        if (
            !aiResult.recommendations ||
            !Array.isArray(aiResult.recommendations)
        ) {
            throw new Error("Invalid recommendation format from AI.");
        }

        // Clean and validate recommendations
        const recommendations = aiResult.recommendations
            .slice(0, 5)
            .map((career) => ({
                title: String(
                    career.title || "Career Recommendation"
                ),

                description: String(
                    career.description || ""
                ),

                matchScore: Math.min(
                    100,
                    Math.max(
                        0,
                        Number(career.matchScore) || 0
                    )
                ),

                whyMatch: String(
                    career.whyMatch || ""
                ),

                skillsToLearn: Array.isArray(career.skillsToLearn)
                    ? career.skillsToLearn
                        .map(String)
                        .slice(0, 10)
                    : [],

                learningRoadmap: Array.isArray(career.learningRoadmap)
                    ? career.learningRoadmap
                        .slice(0, 6)
                        .map((step, index) => ({
                            step: index + 1,
                            title: String(step.title || ""),
                            description: String(step.description || "")
                        }))
                    : [],

                suggestedProjects: Array.isArray(career.suggestedProjects)
                    ? career.suggestedProjects
                        .map(String)
                        .slice(0, 5)
                    : []
            }))
            .filter((career) => career.title);

        if (!recommendations.length) {
            throw new Error(
                "No valid career recommendations generated."
            );
        }

        // Sort by highest match score
        recommendations.sort(
            (a, b) => b.matchScore - a.matchScore
        );

        // Send successful response
        return res.status(200).json({
            success: true,
            message: "AI career recommendations generated successfully.",
            qualification: userData.qualification,
            recommendations
        });

    } catch (error) {
        console.error(
            "AI Career Recommendation Error:",
            error
        );

        // Handle API rate limit
        if (
            error.status === 429 ||
            error.statusCode === 429
        ) {
            return res.status(429).json({
                success: false,
                message: "AI request limit reached. Please try again later."
            });
        }

        // Handle API key errors
        if (
            error.status === 401 ||
            error.status === 403
        ) {
            return res.status(502).json({
                success: false,
                message: "Gemini API authentication failed. Please check the server configuration."
            });
        }

        return res.status(502).json({
            success: false,
            message: "Unable to generate AI career recommendations. Please try again."
        });
    }
};

// AI Interview Answer Evaluation
export const evaluateInterviewAnswer = async (req, res) => {
    try {
        if (!process.env.GEMINI_API_KEY) {
            throw new Error("Gemini API key is missing.");
        }

        const { question, answer, category } = req.body;

        // Validate input
        if (
            !question ||
            typeof question !== "string" ||
            !answer ||
            typeof answer !== "string"
        ) {
            return res.status(400).json({
                success: false,
                message: "Please provide both question and answer."
            });
        }

        if (question.trim().length > 2000 || answer.trim().length > 5000) {
            return res.status(400).json({
                success: false,
                message: "Question or answer is too long."
            });
        }

        const ai = new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY
        });

        const prompt = `
You are an experienced technical and HR interview evaluator.

Evaluate the candidate's answer fairly and constructively.

INTERVIEW CATEGORY: ${String(category || "general").slice(0, 50)}

QUESTION:
${question.trim()}

CANDIDATE'S ANSWER:
${answer.trim()}

Evaluate based on:
1. Relevance to the question.
2. Accuracy and correctness.
3. Clarity and communication.
4. Structure and completeness.
5. Practical examples or supporting details.

Give a realistic score between 0 and 10.
Do not give a high score just to encourage the candidate.
Do not penalize simple language if the answer is correct.

Return ONLY valid JSON in this exact structure:

{
    "score": 7,
    "rating": "Good",
    "strengths": [
        "Strength 1",
        "Strength 2"
    ],
    "improvements": [
        "Improvement 1",
        "Improvement 2"
    ],
    "missingPoints": [
        "Important point 1"
    ],
    "betterAnswer": "A clear and improved sample answer.",
    "overallFeedback": "Short constructive feedback."
}

Keep feedback specific to the candidate's answer.
Do not include Markdown code fences or text outside JSON.
`;

        const response = await ai.models.generateContent({
            model: MODEL_NAME,
            contents: prompt,
            config: {
                temperature: 0.3,
                responseMimeType: "application/json"
            }
        });

        if (!response.text) {
            throw new Error("Gemini returned an empty response.");
        }

        const result = JSON.parse(response.text);

        const score = Number(result.score);

        if (!Number.isFinite(score) || score < 0 || score > 10) {
            throw new Error("Invalid interview evaluation score.");
        }

        return res.status(200).json({
            success: true,
            message: "Interview answer evaluated successfully.",
            evaluation: {
                score,
                rating: String(result.rating || "Evaluated"),
                strengths: Array.isArray(result.strengths)
                    ? result.strengths.map(String).slice(0, 5)
                    : [],
                improvements: Array.isArray(result.improvements)
                    ? result.improvements.map(String).slice(0, 5)
                    : [],
                missingPoints: Array.isArray(result.missingPoints)
                    ? result.missingPoints.map(String).slice(0, 5)
                    : [],
                betterAnswer: String(result.betterAnswer || ""),
                overallFeedback: String(result.overallFeedback || "")
            }
        });

    } catch (error) {
        console.error("AI Interview Evaluation Error:", error);

        if (error.status === 429 || error.statusCode === 429) {
            return res.status(429).json({
                success: false,
                message: "AI request limit reached. Please try again later."
            });
        }

        if (error.status === 401 || error.status === 403) {
            return res.status(502).json({
                success: false,
                message: "Gemini API authentication failed."
            });
        }

        return res.status(502).json({
            success: false,
            message: "Unable to evaluate your answer. Please try again."
        });
    }
};
