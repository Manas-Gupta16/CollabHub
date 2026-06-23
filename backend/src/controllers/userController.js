const bcrypt = require("bcrypt");
const User = require("../models/User");
const asyncHandler = require("../middleware/asyncHandler");
const AppError = require("../utils/AppError");

const createUser = asyncHandler(
    async (req, res) => {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({
            email,
        });

        if (existingUser) {
            throw new AppError(
                "User already exists",
                400
            );
        }

        const hashedPassword =
            await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        res.status(201).json({
            success: true,
            data: user,
        });
    }
);

module.exports = {
    createUser,
};