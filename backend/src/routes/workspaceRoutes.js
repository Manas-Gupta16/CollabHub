const express = require("express");

const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const {
    createWorkspace,
    getMyWorkspaces,
} = require("../controllers/workspaceController");

router.post("/", protect, createWorkspace);

router.get("/", protect, getMyWorkspaces);

module.exports = router;