const express = require("express");

const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const {
    createTask,
    getWorkspaceTasks,
} = require("../controllers/taskController");

router.post(
    "/workspaces/:workspaceId/tasks",
    protect,
    createTask
);

router.get(
    "/workspaces/:workspaceId/tasks",
    protect,
    getWorkspaceTasks
);

module.exports = router;