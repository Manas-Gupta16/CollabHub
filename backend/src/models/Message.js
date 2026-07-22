const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
    {
        content: {
            type: String,
            required: true,
            trim: true,
        },
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        workspace: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Workspace",
            required: true,
        },
        channel: {
            type: String,
            default: "General",
        },
        attachments: [{
            type: String
        }],
    },
    {
        timestamps: true,
    }
);

messageSchema.index({ workspace: 1, createdAt: 1 });

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
