const AppError = require("../utils/AppError");
const Message = require("../models/Message");
const Workspace = require("../models/Workspace");
const { getIO } = require("../socket");

const sendMessage = async (workspaceId, content, currentUser) => {
    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) {
        throw new AppError("Workspace not found", 404);
    }

    const isMember = workspace.members.some(
        (member) => member.user.toString() === currentUser._id.toString()
    );

    if (!isMember) {
        throw new AppError("You are not a member of this workspace", 403);
    }

    const message = await Message.create({
        content,
        workspace: workspaceId,
        sender: currentUser._id,
    });

    await message.populate("sender", "name email");

    // Broadcast the message to all users in the workspace room
    getIO().to(workspaceId).emit("new_message", message);

    return message;
};

const getWorkspaceMessages = async (workspaceId, currentUser, filters) => {
    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) {
        throw new AppError("Workspace not found", 404);
    }

    const isMember = workspace.members.some(
        (member) => member.user.toString() === currentUser._id.toString()
    );

    if (!isMember) {
        throw new AppError("You are not a member of this workspace", 403);
    }

    const page = parseInt(filters.page) || 1;
    const limit = parseInt(filters.limit) || 50;
    const skip = (page - 1) * limit;

    const query = { workspace: workspaceId };

    const totalMessages = await Message.countDocuments(query);
    const messages = await Message.find(query)
        .sort({ createdAt: -1 }) // Newest first
        .skip(skip)
        .limit(limit)
        .populate("sender", "name email");

    return {
        messages: messages.reverse(), // Return oldest to newest for chat UI
        pagination: {
            totalMessages,
            currentPage: page,
            totalPages: Math.ceil(totalMessages / limit),
            limit,
        },
    };
};

module.exports = {
    sendMessage,
    getWorkspaceMessages,
};
