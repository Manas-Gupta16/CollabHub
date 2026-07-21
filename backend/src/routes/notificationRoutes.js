const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
    getUserNotifications,
    markAsRead,
    markAllAsRead,
    acceptInvitation,
    rejectInvitation,
} = require("../controllers/notificationController");

const router = express.Router();

router.use(protect);

router.get("/", getUserNotifications);
router.patch("/read-all", markAllAsRead);
router.patch("/:id/read", markAsRead);
router.post("/:id/accept", acceptInvitation);
router.post("/:id/reject", rejectInvitation);

module.exports = router;
