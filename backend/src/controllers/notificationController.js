const notificationService = require("../services/notificationService");
const asyncHandler = require("../middleware/asyncHandler");

const getUserNotifications = asyncHandler(async (req, res) => {
    const notifications = await notificationService.getUserNotifications(req.user._id);

    res.status(200).json({
        success: true,
        data: notifications,
    });
});

const markAsRead = asyncHandler(async (req, res) => {
    const notification = await notificationService.markAsRead(req.params.id, req.user._id);

    res.status(200).json({
        success: true,
        data: notification,
    });
});

const markAllAsRead = asyncHandler(async (req, res) => {
    await notificationService.markAllAsRead(req.user._id);

    res.status(200).json({
        success: true,
        message: "All notifications marked as read",
    });
});

module.exports = {
    getUserNotifications,
    markAsRead,
    markAllAsRead,
};
