const AppError = require("../utils/AppError");
const Message = require("../models/Message");
const Workspace = require("../models/Workspace");
const { getIO } = require("../socket");

const User = require("../models/User");
const notificationService = require("./notificationService");

const sendMessage = async (workspaceId, content, currentUser, files = []) => {
    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) {
        throw new AppError("Workspace not found", 404);
    }

    const isMember = workspace.members.some(
        (member) => member.user.toString() === currentUser._id.toString() && member.status !== "PENDING"
    );

    if (!isMember) {
        throw new AppError("You are not a member of this workspace", 403);
    }

    // Handle Attachments
    const attachments = files ? files.map(file => `/uploads/${file.filename}`) : [];

    const message = await Message.create({
        content,
        workspace: workspaceId,
        sender: currentUser._id,
        attachments,
    });

    await message.populate("sender", "name email");

    // Extract Mentions
    const mentionRegex = /@([a-zA-Z0-9_]+)/g;
    const mentions = content.match(mentionRegex);
    
    if (mentions && mentions.length > 0) {
        const usernames = mentions.map(m => m.substring(1)); // Remove @
        const mentionedUsers = [];
        for (const username of usernames) {
            const matches = await User.find({
                name: { $regex: new RegExp(`^${username}$|^${username}\\s`, "i") }
            });
            mentionedUsers.push(...matches);
        }

        // Deduplicate matched users
        const uniqueUserIds = new Set();
        const uniqueMentionedUsers = [];
        for (const u of mentionedUsers) {
            if (!uniqueUserIds.has(u._id.toString())) {
                uniqueUserIds.add(u._id.toString());
                uniqueMentionedUsers.push(u);
            }
        }
        
        for (const user of uniqueMentionedUsers) {
            // Ensure they are in the workspace
            const isMentionedUserMember = workspace.members.some(
                m => m.user.toString() === user._id.toString() && m.status !== "PENDING"
            );

            if (isMentionedUserMember) {
                await notificationService.createNotification({
                    recipientId: user._id,
                    type: "MENTION",
                    message: `${currentUser.name} mentioned you in a message in ${workspace.name}`,
                    workspaceId: workspaceId,
                    relatedEntityId: message._id
                });
            }
        }
    }

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
        (member) => member.user.toString() === currentUser._id.toString() && member.status !== "PENDING"
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
