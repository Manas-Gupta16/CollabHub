const taskService = require("../services/taskService");
const asyncHandler = require("../middleware/asyncHandler");

const createTask = asyncHandler(
    async (req, res) => {
        const task =
            await taskService.createTask(
                req.params.workspaceId,
                req.body,
                req.user
            );

        res.status(201).json({
            success: true,
            data: task,
        });
    }
);

const getWorkspaceTasks = asyncHandler(
    async (req, res) => {
        const tasks =
            await taskService.getWorkspaceTasks(
                req.params.workspaceId,
                req.user,
                req.query
            );

        res.status(200).json({
            success: true,
            data: tasks,
        });
    }
);

const assignTask = asyncHandler(
    async (req, res) => {
        const task =
            await taskService.assignTask(
                req.params.taskId,
                req.body.assigneeId,
                req.user
            );

        res.status(200).json({
            success: true,
            data: task,
        });
    }
);

const updateTaskStatus = asyncHandler(
    async (req, res) => {
        const task =
            await taskService.updateTaskStatus(
                req.params.taskId,
                req.body.status,
                req.user
            );

        res.status(200).json({
            success: true,
            data: task,
        });
    }
);

const updateTask = asyncHandler(
    async (req, res) => {
        const task =
            await taskService.updateTask(
                req.params.taskId,
                req.body,
                req.user
            );

        res.status(200).json({
            success: true,
            data: task,
        });
    }
);

const deleteTask = asyncHandler(
    async (req, res) => {
        const result =
            await taskService.deleteTask(
                req.params.taskId,
                req.user
            );

        res.status(200).json({
            success: true,
            data: result,
        });
    }
);

module.exports = {
    createTask,
    getWorkspaceTasks,
    assignTask,
    updateTaskStatus,
    updateTask,
    deleteTask,
};