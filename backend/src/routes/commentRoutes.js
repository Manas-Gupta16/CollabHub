/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: Task comments endpoints
 */

const express = require("express");

const router = express.Router();

const {
    protect,
} = require(
    "../middleware/authMiddleware"
);

const {
    addCommentValidator,
} = require("../validators/commentValidator");

const validate = require(
    "../middleware/validationMiddleware"
);

const {
    addComment,
    getTaskComments,
} = require(
    "../controllers/commentController"
);

/**
 * @swagger
 * /tasks/{taskId}/comments:
 *   post:
 *     summary: Add a comment to a task
 *     tags: [Comments]
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
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Comment added successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 */
router.post(
    "/tasks/:taskId/comments",
    protect,
    addCommentValidator,
    validate,
    addComment
);

/**
 * @swagger
 * /tasks/{taskId}/comments:
 *   get:
 *     summary: Get all comments for a task
 *     tags: [Comments]
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
 *         description: List of comments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Comment'
 */
router.get(
    "/tasks/:taskId/comments",
    protect,
    getTaskComments
);

module.exports = router;