const express = require("express");

const router = express.Router();

const {
    protect,
} = require(
    "../middleware/authMiddleware"
);

const {
    addComment,
    getTaskComments,
} = require(
    "../controllers/commentController"
);

router.post(
    "/tasks/:taskId/comments",
    protect,
    addComment
);

router.get(
    "/tasks/:taskId/comments",
    protect,
    getTaskComments
);

module.exports = router;