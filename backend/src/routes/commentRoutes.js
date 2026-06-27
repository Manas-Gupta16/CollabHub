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

router.post(
    "/tasks/:taskId/comments",
    protect,
    addCommentValidator,
    validate,
    addComment
);

router.get(
    "/tasks/:taskId/comments",
    protect,
    getTaskComments
);

module.exports = router;