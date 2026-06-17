const express = require("express");

const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const {
    createTask,
    getWorkspaceTasks,
    assignTask,
    updateTaskStatus,
    updateTask,
    deleteTask
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

router.patch(
    "/tasks/:taskId/assign",
    protect,
    assignTask
);

router.patch(
    "/tasks/:taskId/status",
    protect,
    updateTaskStatus
);

router.patch(
    "/tasks/:taskId",
    protect,
    updateTask
);

router.delete(
    "/tasks/:taskId",
    protect,
    deleteTask
);

module.exports = router;