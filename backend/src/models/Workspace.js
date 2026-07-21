const mongoose = require("mongoose");

const workspaceSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
            trim: true,
        },

        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        members: [
            {
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                    required: true,
                },

                role: {
                    type: String,
                    enum: ["OWNER", "ADMIN", "MEMBER"],
                    default: "MEMBER",
                },

                status: {
                    type: String,
                    enum: ["ACTIVE", "PENDING"],
                    default: "ACTIVE",
                },
            },
        ],

        channels: [
            {
                name: { type: String, required: true },
                isPrivate: { type: Boolean, default: false }
            }
        ],

        pinnedLinks: [
            {
                title: { type: String, required: true },
                url: { type: String, required: true }
            }
        ],

        keyDeadlines: [
            {
                title: { type: String, required: true },
                date: { type: Date, required: true }
            }
        ],

        teamGoals: [
            {
                title: { type: String, required: true },
                isCompleted: { type: Boolean, default: false }
            }
        ]
    },
    {
        timestamps: true,
    }
);

const Workspace = mongoose.model(
    "Workspace",
    workspaceSchema
);

module.exports = Workspace;