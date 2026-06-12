const express = require("express");

const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const {
    createTask,
    getWorkspaceTasks,
    assignTask,
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

module.exports = router;