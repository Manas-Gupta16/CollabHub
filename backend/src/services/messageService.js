const AppError = require("../utils/AppError");
const Message = require("../models/Message");
const Workspace = require("../models/Workspace");
const { getIO } = require("../socket");

const User = require("../models/User");
const notificationService = require("./notificationService");

const sendMessage = async (workspaceId, content, currentUser, files = [], channelName = "General") => {
    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) {
        throw new AppError("Workspace not found", 404);
    }

    const currentMember = workspace.members.find(
        (member) => (member.user._id || member.user).toString() === currentUser._id.toString() && member.status !== "PENDING"
    );

    if (!currentMember) {
        throw new AppError("You are not a member of this workspace", 403);
    }

    // Check Channel Privacy
    const channelObj = workspace.channels.find(
        (c) => c.name.toLowerCase() === (channelName || "General").toLowerCase()
    );
    if (channelObj && channelObj.isPrivate) {
        const isChannelMember = channelObj.members.some(
            (m) => m.toString() === currentUser._id.toString()
        );
        const isOwnerOrAdmin = currentMember.role === "OWNER" || currentMember.role === "ADMIN";
        if (!isChannelMember && !isOwnerOrAdmin) {
            throw new AppError("You do not have access to this private channel", 403);
        }
    }

    // Handle Attachments
    const attachments = files ? files.map(file => `/uploads/${file.filename}`) : [];

    const message = await Message.create({
        content,
        workspace: workspaceId,
        channel: channelName || "General",
        sender: currentUser._id,
        attachments,
    });

    await message.populate("sender", "name email avatar profileImage");

    // Extract & Trigger Mentions for Workspace Members
    await workspace.populate("members.user", "name email");

    const contentLower = content.toLowerCase();

    for (const member of workspace.members) {
        if (!member.user || member.status === "PENDING") continue;

        const targetUser = member.user;
        const targetUserId = (targetUser._id || targetUser).toString();

        // Skip notifying the sender themselves
        if (targetUserId === currentUser._id.toString()) continue;

        const fullName = (targetUser.name || '').trim().toLowerCase();
        const firstName = fullName.split(' ')[0] || '';
        const emailHandle = (targetUser.email || '').split('@')[0]?.toLowerCase() || '';
        const nameNoSpaces = fullName.replace(/\s+/g, '');

        const isMentioned = 
            (fullName && contentLower.includes(`@${fullName}`)) ||
            (firstName && contentLower.includes(`@${firstName}`)) ||
            (nameNoSpaces && contentLower.includes(`@${nameNoSpaces}`)) ||
            (emailHandle && contentLower.includes(`@${emailHandle}`));

        if (isMentioned) {
            await notificationService.createNotification({
                recipientId: targetUser._id,
                type: "MENTION",
                message: `${currentUser.name} mentioned you in #${channelName || "General"} in ${workspace.name}`,
                workspaceId: workspaceId,
                relatedEntityId: message._id
            });
        }
    }

    // Broadcast the message to all users in the workspace room
    getIO().to(workspaceId).emit("new_message", message);

    return message;
};

const getWorkspaceMessages = async (workspaceId, currentUser, filters = {}) => {
    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) {
        throw new AppError("Workspace not found", 404);
    }

    const currentMember = workspace.members.find(
        (member) => (member.user._id || member.user).toString() === currentUser._id.toString() && member.status !== "PENDING"
    );

    if (!currentMember) {
        throw new AppError("You are not a member of this workspace", 403);
    }

    const channelName = filters.channel || "General";

    // Check Channel Privacy
    const channelObj = workspace.channels.find(
        (c) => c.name.toLowerCase() === channelName.toLowerCase()
    );
    if (channelObj && channelObj.isPrivate) {
        const isChannelMember = channelObj.members.some(
            (m) => m.toString() === currentUser._id.toString()
        );
        const isOwnerOrAdmin = currentMember.role === "OWNER" || currentMember.role === "ADMIN";
        if (!isChannelMember && !isOwnerOrAdmin) {
            throw new AppError("You do not have access to this private channel", 403);
        }
    }

    const page = parseInt(filters.page) || 1;
    const limit = parseInt(filters.limit) || 50;
    const skip = (page - 1) * limit;

    const query = { workspace: workspaceId, channel: channelName };

    const totalMessages = await Message.countDocuments(query);
    const messages = await Message.find(query)
        .sort({ createdAt: -1 }) // Newest first
        .skip(skip)
        .limit(limit)
        .populate("sender", "name email avatar profileImage");

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
