const AppError = require("../utils/AppError");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");

const registerUser = async (userData) => {
    const { name, email, password } = userData;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
        throw new AppError(
            "User already exists",
            400
        );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        name,
        email,
        password: hashedPassword,
    });

    const userResponse = {
        _id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
    };

    return userResponse;
};

const loginUser = async (userData) => {
    const { email, password } = userData;

    const user = await User.findOne({ email });

    if (!user) {
        throw new AppError(
            "Invalid credentials",
            401
        );
    }

    const isPasswordMatch = await bcrypt.compare(
        password,
        user.password
    );

    if (!isPasswordMatch) {
        throw new AppError(
            "Invalid credentials",
            401
        );
    }

    const token = generateToken(user._id);

    return {
        token,
        user: {
            _id: user._id,
            name: user.name,
            email: user.email,
        },
    };
};

module.exports = {
    registerUser,
    loginUser,
};