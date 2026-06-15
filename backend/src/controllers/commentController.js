const commentService = require(
    "../services/commentService"
);

const addComment = async (
    req,
    res
) => {
    try {
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
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

const getTaskComments = async (
    req,
    res
) => {
    try {
        const comments =
            await commentService.getTaskComments(
                req.params.taskId,
                req.user
            );

        res.status(200).json({
            success: true,
            data: comments,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    addComment,
    getTaskComments,
};