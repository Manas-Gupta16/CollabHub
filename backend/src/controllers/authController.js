const authService = require("../services/authService");
const asyncHandler = require("../middleware/asyncHandler");
const bcrypt = require("bcrypt");
const User = require("../models/User");

const register = asyncHandler(
    async (req, res) => {
        const user = await authService.registerUser(req.body);

        res.status(201).json({
            success: true,
            data: user,
        });
    }
);

const login = asyncHandler(
    async (req, res) => {
        const result = await authService.loginUser(req.body);

        res.status(200).json({
            success: true,
            data: result,
        });
    }
);

const getProfile = asyncHandler(
    async (req, res) => {
        res.status(200).json({
            success: true,
            user: req.user,
        });
    }
);

const updateProfile = asyncHandler(
    async (req, res) => {
        const user = await User.findById(req.user._id);
        
        if (req.body.name) {
            user.name = req.body.name;
        }
        if (req.body.email) {
            user.email = req.body.email;
        }
        if (req.body.password) {
            user.password = await bcrypt.hash(req.body.password, 10);
        }
        
        if (req.body.removeAvatar === "true" || req.body.removeAvatar === true) {
            user.avatar = "";
        } else if (req.file) {
            user.avatar = `/uploads/${req.file.filename}`;
        } else if (req.body.avatarUrl || req.body.avatar) {
            user.avatar = req.body.avatarUrl || req.body.avatar;
        }
        
        await user.save();

        res.status(200).json({
            success: true,
            user,
        });
    }
);

const googleLogin = asyncHandler(
    async (req, res) => {
        const result = await authService.googleAuth(req.body.idToken);

        res.status(200).json({
            success: true,
            data: result,
        });
    }
);

const forgotPassword = asyncHandler(
    async (req, res) => {
        const result = await authService.forgotPassword(req.body.email);
        res.status(200).json({
            success: true,
            data: result,
        });
    }
);

const resetPassword = asyncHandler(
    async (req, res) => {
        const result = await authService.resetPassword(req.body.token, req.body.password);
        res.status(200).json({
            success: true,
            data: result,
        });
    }
);

module.exports = {
    register,
    login,
    googleLogin,
    getProfile,
    updateProfile,
    forgotPassword,
    resetPassword,
};