const taskService = require("../services/taskService");

const createTask = async (req, res) => {
    try {
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
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

const getWorkspaceTasks = async (req, res) => {
    try {
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
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

const assignTask = async (req, res) => {
    try {
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
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

const updateTaskStatus = async (
    req,
    res
) => {
    try {
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
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    createTask,
    getWorkspaceTasks,
    assignTask,
    updateTaskStatus,
};