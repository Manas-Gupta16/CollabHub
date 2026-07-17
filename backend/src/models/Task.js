const mongoose = require("mongoose");

const {
    TASK_STATUS,
    TASK_PRIORITY,
} = require("../constants/taskConstants");

const taskSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
            trim: true,
        },

        status: {
            type: String,
            enum: Object.values(TASK_STATUS),
            default: TASK_STATUS.TODO,
        },

        priority: {
            type: String,
            enum: Object.values(TASK_PRIORITY),
            default: TASK_PRIORITY.MEDIUM,
        },

        workspace: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Workspace",
            required: true,
        },

        assignee: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        dueDate: {
            type: Date,
        },

        attachments: [{
            type: String
        }],
    },
    {
        timestamps: true,
    }
);

taskSchema.index({ workspace: 1 });
taskSchema.index({ assignee: 1 });
taskSchema.index({ status: 1 });

const Task = mongoose.model(
    "Task",
    taskSchema
);

module.exports = Task;