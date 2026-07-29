const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },

        password: {
            type: String,
            required: function () {
                return !this.googleId;
            },
            minlength: 6,
        },

        googleId: {
            type: String,
        },

        avatar: {
            type: String,
        },

        title: {
            type: String,
            default: "",
        },

        bio: {
            type: String,
            default: "",
        },

        location: {
            type: String,
            default: "",
        },

        website: {
            type: String,
            default: "",
        },

        resetPasswordToken: {
            type: String,
        },

        resetPasswordExpire: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

const User = mongoose.model("User", userSchema);

module.exports = User;