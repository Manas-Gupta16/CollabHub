/**
 * @swagger
 * tags:
 *   name: Tasks
 *   description: Task management endpoints
 */

const express = require("express");

const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

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

/**
 * @swagger
 * /workspaces/{workspaceId}/tasks:
 *   post:
 *     summary: Create a new task in a workspace
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: workspaceId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the workspace
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *               priority:
 *                 type: string
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Task created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 */
router.post(
    "/workspaces/:workspaceId/tasks",
    protect,
    upload.array("attachments", 5),
    createTaskValidator,
    validate,
    createTask
);

/**
 * @swagger
 * /workspaces/{workspaceId}/tasks:
 *   get:
 *     summary: Get all tasks for a workspace
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: workspaceId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of tasks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
 */
router.get(
    "/workspaces/:workspaceId/tasks",
    protect,
    getWorkspaceTasks
);

/**
 * @swagger
 * /tasks/{taskId}/assign:
 *   patch:
 *     summary: Assign a task to users
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               assignees:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Task assigned successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 */
router.patch(
    "/tasks/:taskId/assign",
    protect,
    assignTaskValidator,
    validate,
    assignTask
);

/**
 * @swagger
 * /tasks/{taskId}/status:
 *   patch:
 *     summary: Update task status
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Task status updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 */
router.patch(
    "/tasks/:taskId/status",
    protect,
    updateStatusValidator,
    validate,
    updateTaskStatus
);

/**
 * @swagger
 * /tasks/{taskId}:
 *   patch:
 *     summary: Update task details
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               priority:
 *                 type: string
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Task updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 */
router.patch(
    "/tasks/:taskId",
    protect,
    upload.array("attachments", 5),
    updateTask
);

/**
 * @swagger
 * /tasks/{taskId}:
 *   delete:
 *     summary: Delete a task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Task deleted successfully
 */
router.delete(
    "/tasks/:taskId",
    protect,
    deleteTask
);

module.exports = router;