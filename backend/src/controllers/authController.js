const authService = require("../services/authService");
const asyncHandler = require("../middleware/asyncHandler");
const bcrypt = require("bcrypt");

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
        }
        
        await user.save();

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