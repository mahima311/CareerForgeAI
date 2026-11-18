
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// =================================
// USER SIGNUP
// =================================

export const signup = async (req, res) => {
    try {
        const { name, email, password, qualification, skills, interests } = req.body;

        // Check required fields
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Name, email and password are required"
            });
        }

        // Check existing user
        const existingUser = await User.findOne({
            email: email.toLowerCase().trim()
        });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "User already exists with this email"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            qualification,
            skills,
            interests
        });

        // Generate JWT
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        return res.status(201).json({
            success: true,
            message: "Account created successfully",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                qualification: user.qualification,
                skills: user.skills,
                interests: user.interests
            }
        });

    } catch (error) {
        console.error("Signup Error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error during signup"
        });
    }
};

// =================================
// USER LOGIN
// =================================

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check required fields
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        // Find user
        const user = await User.findOne({
            email: email.toLowerCase().trim()
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // Compare password
        const isPasswordValid = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // Generate JWT
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        return res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                qualification: user.qualification,
                skills: user.skills,
                interests: user.interests
            }
        });

    } catch (error) {
        console.error("Login Error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error during login"
        });
    }
};
