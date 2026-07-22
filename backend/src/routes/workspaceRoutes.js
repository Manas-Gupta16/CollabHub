/**
 * @swagger
 * tags:
 *   name: Workspaces
 *   description: Workspace management endpoints
 */

const express = require("express");

const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const {
    createWorkspaceValidator,
    addMemberValidator,
    createChannelValidator,
} = require("../validators/workspaceValidator");

const validate = require(
    "../middleware/validationMiddleware"
);

const {
    createWorkspace,
    getMyWorkspaces,
    getWorkspaceById,
    updateWorkspace,
    addMemberToWorkspace,
    updateMemberRole,
    getWorkspaceStats,
    createChannel,
    addMemberToChannel,
    removeMemberFromChannel,
    removeMemberFromWorkspace,
    deleteChannel,
} = require(
    "../controllers/workspaceController"
);

/**
 * @swagger
 * /workspaces:
 *   post:
 *     summary: Create a new workspace
 *     tags: [Workspaces]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Project Alpha
 *               description:
 *                 type: string
 *                 example: Team collaboration workspace
 *     responses:
 *       201:
 *         description: Workspace created successfully
 *       401:
 *         description: Unauthorized
 */
router.post("/", protect, createWorkspaceValidator, validate, createWorkspace);

/**
 * @swagger
 * /workspaces:
 *   get:
 *     summary: Get all workspaces for the current user
 *     tags: [Workspaces]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of workspaces
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: 507f1f77bcf86cd799439011
 *                   name:
 *                     type: string
 *                     example: Project Alpha
 *                   members:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         user:
 *                           type: string
 *                           example: 507f1f77bcf86cd799439011
 *                         role:
 *                           type: string
 *                           example: OWNER
 */
router.get("/", protect, getMyWorkspaces);

/**
 * @swagger
 * /workspaces/{workspaceId}:
 *   get:
 *     summary: Get workspace details by ID
 *     tags: [Workspaces]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: workspaceId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the workspace
 *     responses:
 *       200:
 *         description: Workspace details
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Workspace not found
 */
router.get("/:workspaceId", protect, getWorkspaceById);

/**
 * @swagger
 * /workspaces/{id}/members:
 *   post:
 *     summary: Add member to workspace
 *     tags: [Workspaces]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
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
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 example: member@gmail.com
 *               role:
 *                 type: string
 *                 example: MEMBER
 *     responses:
 *       200:
 *         description: Member added successfully
 *       403:
 *         description: Only owner can add members
 */
router.post("/:workspaceId/members", protect, addMemberValidator, validate, addMemberToWorkspace);

/**
 * @swagger
 * /workspaces/{id}/members/role:
 *   patch:
 *     summary: Update member role in workspace
 *     tags: [Workspaces]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
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
 *               - userId
 *               - role
 *             properties:
 *               userId:
 *                 type: string
 *                 example: 507f1f77bcf86cd799439011
 *               role:
 *                 type: string
 *                 example: ADMIN
 *     responses:
 *       200:
 *         description: Member role updated successfully
 *       403:
 *         description: Only owner can update roles
 */
router.patch("/:workspaceId/members/role", protect, updateMemberRole);

/**
 * @swagger
 * /workspaces/{workspaceId}/stats:
 *   get:
 *     summary: Get workspace analytics
 *     tags: [Workspaces]
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
 *         description: Workspace statistics returned
 */
router.get("/:workspaceId/stats", protect, getWorkspaceStats);

router.post("/:workspaceId/channels", protect, createChannelValidator, validate, createChannel);
router.post("/:workspaceId/channels/:channelName/members", protect, addMemberToChannel);
router.delete("/:workspaceId/channels/:channelName/members/:userId", protect, removeMemberFromChannel);

router.delete("/:workspaceId/members/:userId", protect, removeMemberFromWorkspace);
router.delete("/:workspaceId/channels/:channelName", protect, deleteChannel);

module.exports = router;