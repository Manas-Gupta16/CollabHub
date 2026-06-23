const commentService = require(
    "../services/commentService"
);
const asyncHandler = require("../middleware/asyncHandler");

const addComment = asyncHandler(
    async (req, res) => {
        const comment =
            await commentService.addComment(
                req.params.taskId,
                req.body.content,
                req.user
            );

        res.status(201).json({
            success: true,
            data: comment,
        });
    }
);

const getTaskComments = asyncHandler(
    async (req, res) => {
        const comments =
            await commentService.getTaskComments(
                req.params.taskId,
                req.user
            );

        res.status(200).json({
            success: true,
            data: comments,
        });
    }
);

module.exports = {
    addComment,
    getTaskComments,
};