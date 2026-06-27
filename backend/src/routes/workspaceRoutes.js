const express = require("express");

const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const {
    createWorkspaceValidator,
    addMemberValidator,
} = require("../validators/workspaceValidator");

const validate = require(
    "../middleware/validationMiddleware"
);

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

router.post("/", protect, createWorkspaceValidator, validate, createWorkspace);

router.get("/", protect, getMyWorkspaces);

router.get("/:workspaceId", protect, getWorkspaceById);

router.post("/:workspaceId/members", protect, addMemberValidator, validate, addMemberToWorkspace);

router.patch("/:workspaceId/members/role", protect, updateMemberRole);

router.get("/:workspaceId/stats", protect, getWorkspaceStats);

module.exports = router;