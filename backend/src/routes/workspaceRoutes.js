const express = require("express");

const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const {
    createWorkspace,
    getMyWorkspaces,
    getWorkspaceById,
    addMemberToWorkspace,
    updateMemberRole,
    getWorkspaceStats,
} = require(
    "../controllers/workspaceController"
);

router.post("/", protect, createWorkspace);

router.get("/", protect, getMyWorkspaces);

router.get("/:id", protect, getWorkspaceById);

router.post("/:id/members", protect, addMemberToWorkspace);

router.patch("/:workspaceId/members/role", protect, updateMemberRole);

router.get("/:workspaceId/stats", protect, getWorkspaceStats);

module.exports = router;