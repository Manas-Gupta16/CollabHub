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
                isPrivate: { type: Boolean, default: false },
                members: [
                    {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "User"
                    }
                ]
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
        ],

        subscriptionPlan: {
            type: String,
            enum: ["FREE", "PRO", "ENTERPRISE"],
            default: "FREE"
        },

        billingCycle: {
            type: String,
            enum: ["MONTHLY", "YEARLY"],
            default: "MONTHLY"
        }
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