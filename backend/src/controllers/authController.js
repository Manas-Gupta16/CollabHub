const authService = require("../services/authService");
const asyncHandler = require("../middleware/asyncHandler");

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
        const user = req.user;
        if (req.file) {
            user.avatar = `/uploads/${req.file.filename}`;
            await user.save();
        }

        res.status(200).json({
            success: true,
            user,
        });
    }
);

module.exports = {
    register,
    login,
    getProfile,
    updateProfile,
};