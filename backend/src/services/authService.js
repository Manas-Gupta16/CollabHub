const bcrypt = require("bcrypt");
const User = require("../models/User");

const registerUser = async (userData) => {
    const { name, email, password } = userData;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
        throw new Error("User already exists");
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

module.exports = {
    registerUser,
};