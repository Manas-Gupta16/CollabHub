const Notification = require("../models/Notification");
const AppError = require("../utils/AppError");
const { getIO } = require("../socket");

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

module.exports = {
    createNotification,
    getUserNotifications,
    markAsRead,
    markAllAsRead,
};
