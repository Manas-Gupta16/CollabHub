const AppError = require("../utils/AppError");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const { OAuth2Client } = require("google-auth-library");

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "520090818270-bl41rgog0mmvu15bp3gthsaprikcugqd.apps.googleusercontent.com";
const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

const registerUser = async (userData) => {
    const { name, email, password } = userData;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
        throw new AppError("User already exists", 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        name,
        email,
        password: hashedPassword,
    });

    return {
        _id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
    };
};

const loginUser = async (userData) => {
    const { email, password } = userData;

    const user = await User.findOne({ email });

    if (!user) {
        throw new AppError("Invalid credentials", 401);
    }

    if (!user.password && user.googleId) {
        throw new AppError("Please sign in with Google for this account", 400);
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
        throw new AppError("Invalid credentials", 401);
    }

    const token = generateToken(user._id);

    return {
        token,
        user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
        },
    };
};

const googleAuth = async (idToken) => {
    let payload;
    try {
        const ticket = await googleClient.verifyIdToken({
            idToken,
            audience: GOOGLE_CLIENT_ID,
        });
        payload = ticket.getPayload();
    } catch (err) {
        throw new AppError("Invalid or expired Google token", 401);
    }

    if (!payload || !payload.email) {
        throw new AppError("Google authentication failed", 400);
    }

    const { email, name, picture, sub: googleId } = payload;

    let user = await User.findOne({ email });

    if (!user) {
        user = await User.create({
            name: name || email.split("@")[0],
            email,
            avatar: picture,
            googleId,
        });
    } else if (!user.googleId) {
        user.googleId = googleId;
        if (!user.avatar && picture) user.avatar = picture;
        await user.save();
    }

    const token = generateToken(user._id);

    return {
        token,
        user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
        },
    };
};

const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");

const forgotPassword = async (email) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw new AppError("No account found with that email address", 404);
    }

    if (!user.password && user.googleId) {
        throw new AppError("This account uses Google Sign-In. Please sign in with Google.", 400);
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

    await user.save();

    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
    const resetUrl = `${frontendUrl}/reset-password?token=${resetToken}`;

    const message = `You requested a password reset for your CollabHub account.\n\nPlease click the following link to reset your password:\n${resetUrl}\n\nThis link is valid for 15 minutes. If you did not request this, please ignore this email.`;

    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
            <h2 style="color: #4F46E5;">CollabHub Password Reset</h2>
            <p>You requested a password reset for your account (<strong>${user.email}</strong>).</p>
            <p>Click the button below to reset your password. This link is valid for 15 minutes:</p>
            <div style="margin: 25px 0;">
                <a href="${resetUrl}" style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Reset Password</a>
            </div>
            <p style="font-size: 12px; color: #777;">If the button doesn't work, copy and paste this link into your browser:<br/><a href="${resetUrl}">${resetUrl}</a></p>
            <hr style="border: none; border-top: 1px solid #eee; margin-top: 20px;"/>
            <p style="font-size: 11px; color: #aaa;">If you did not request a password reset, you can safely ignore this email.</p>
        </div>
    `;

    try {
        await sendEmail({
            email: user.email,
            subject: "CollabHub - Password Reset Request",
            message,
            html,
        });
    } catch (err) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();
        throw new AppError("Email could not be sent. Please try again later.", 500);
    }

    return { message: "Password reset link sent to your email!" };
};

const resetPassword = async (token, newPassword) => {
    if (!token || !newPassword) {
        throw new AppError("Token and new password are required", 400);
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
        throw new AppError("Invalid or expired password reset token", 400);
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    return { message: "Password reset successful! You can now log in with your new password." };
};

module.exports = {
    registerUser,
    loginUser,
    googleAuth,
    forgotPassword,
    resetPassword,
};