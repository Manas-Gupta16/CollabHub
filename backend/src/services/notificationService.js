const Notification = require("../models/Notification");
const AppError = require("../utils/AppError");
const { getIO } = require("../socket");
const Workspace = require("../models/Workspace");
const activityService = require("./activityService");
const { ACTIVITY_ACTIONS } = require("../constants/activityConstants");

const createNotification = async ({ recipientId, type, message, workspaceId, relatedEntityId }) => {
    const notification = await Notification.create({
        recipient: recipientId,
        type,
        message,
        workspace: workspaceId,
        relatedEntity: relatedEntityId
    });

    try {
        getIO().to(recipientId.toString()).emit("new_notification", notification);
    } catch (err) {
        // Ignore if socket is not initialized
    }

    return notification;
};

const getUserNotifications = async (userId) => {
    const notifications = await Notification.find({ recipient: userId })
        .sort({ createdAt: -1 })
        .limit(50);
    return notifications;
};

const markAsRead = async (notificationId, userId) => {
    const notification = await Notification.findOneAndUpdate(
        { _id: notificationId, recipient: userId },
        { isRead: true },
        { new: true }
    );

    if (!notification) {
        throw new AppError("Notification not found", 404);
    }

    return notification;
};

const markAllAsRead = async (userId) => {
    await Notification.updateMany(
        { recipient: userId, isRead: false },
        { isRead: true }
    );
    return { success: true };
};

const acceptInvitation = async (notificationId, userId) => {
    const notification = await Notification.findOne({ _id: notificationId, recipient: userId });
    if (!notification) {
        throw new AppError("Notification not found", 404);
    }
    if (notification.type !== "WORKSPACE_INVITATION") {
        throw new AppError("Notification is not a workspace invitation", 400);
    }

    const workspace = await Workspace.findById(notification.workspace);
    if (!workspace) {
        throw new AppError("Workspace not found", 404);
    }

    const member = workspace.members.find(
        (m) => m.user.toString() === userId.toString()
    );
    if (!member) {
        throw new AppError("You are not listed in this workspace's members list", 400);
    }

    if (member.status === "ACTIVE") {
        // Already active, just mark notification as read/deleted
        await Notification.findByIdAndDelete(notificationId);
        return { workspace, alreadyActive: true };
    }

    member.status = "ACTIVE";
    await workspace.save();

    await activityService.createActivity({
        workspace: workspace._id,
        user: userId,
        action: ACTIVITY_ACTIONS.MEMBER_ADDED,
        details: `Joined workspace: ${workspace.name}`,
    });

    await Notification.findByIdAndDelete(notificationId);

    return { workspace };
};

const rejectInvitation = async (notificationId, userId) => {
    const notification = await Notification.findOne({ _id: notificationId, recipient: userId });
    if (!notification) {
        throw new AppError("Notification not found", 404);
    }
    if (notification.type !== "WORKSPACE_INVITATION") {
        throw new AppError("Notification is not a workspace invitation", 400);
    }

    const workspace = await Workspace.findById(notification.workspace);
    if (workspace) {
        workspace.members = workspace.members.filter(
            (m) => m.user.toString() !== userId.toString()
        );
        await workspace.save();
    }

    await Notification.findByIdAndDelete(notificationId);

    return { success: true };
};

module.exports = {
    createNotification,
    getUserNotifications,
    markAsRead,
    markAllAsRead,
    acceptInvitation,
    rejectInvitation,
};
