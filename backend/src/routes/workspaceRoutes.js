const express = require("express");

const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const {
    createWorkspace,
    getMyWorkspaces,
    getWorkspaceById,
    addMemberToWorkspace,
} = require("../controllers/workspaceController");

router.post("/", protect, createWorkspace);

router.get("/", protect, getMyWorkspaces);

router.get("/:id", protect, getWorkspaceById);

router.post("/:id/members", protect, addMemberToWorkspace);

module.exports = router;