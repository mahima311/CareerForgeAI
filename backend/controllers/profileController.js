
import User from "../models/User.js";

// Get Logged-in User Profile
export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Profile fetched successfully",
            user
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// Update User Profile
export const updateProfile = async (req, res) => {
    try {
        const { name, qualification, skills, interests } = req.body;

        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        if (name !== undefined) user.name = name;
        if (qualification !== undefined) user.qualification = qualification;
        if (skills !== undefined) user.skills = skills;
        if (interests !== undefined) user.interests = interests;

        const updatedUser = await user.save();

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: {
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                qualification: updatedUser.qualification,
                skills: updatedUser.skills,
                interests: updatedUser.interests
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
