const express = require("express");

const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const {
    createTaskValidator,
    assignTaskValidator,
    updateStatusValidator,
} = require("../validators/taskValidator");

const validate = require(
    "../middleware/validationMiddleware"
);

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
    createTaskValidator,
    validate,
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
    assignTaskValidator,
    validate,
    assignTask
);

router.patch(
    "/tasks/:taskId/status",
    protect,
    updateStatusValidator,
    validate,
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