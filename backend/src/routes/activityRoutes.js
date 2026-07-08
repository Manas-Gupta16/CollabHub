/**
 * @swagger
 * tags:
 *   name: Activities
 *   description: Workspace activity log endpoints
 */

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

/**
 * @swagger
 * /workspaces/{workspaceId}/activity:
 *   get:
 *     summary: Get recent activities for a workspace
 *     tags: [Activities]
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
 *         description: List of recent activities
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Activity'
 */
router.get(
    "/:workspaceId/activity",
    protect,
    getWorkspaceActivities
);

module.exports = router;