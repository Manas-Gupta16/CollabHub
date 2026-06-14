const express = require("express");

const router = express.Router();

const {
    protect,
} = require("../middleware/authMiddleware");

const {
    getWorkspaceActivities,
} = require(
    "../controllers/activityController"
);

router.get(
    "/:workspaceId/activity",
    protect,
    getWorkspaceActivities
);

module.exports = router;