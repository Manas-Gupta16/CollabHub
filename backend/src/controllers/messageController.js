const messageService = require("../services/messageService");
const asyncHandler = require("../middleware/asyncHandler");

const sendMessage = asyncHandler(async (req, res) => {
    const message = await messageService.sendMessage(
        req.params.workspaceId,
        req.body.content,
        req.user,
        req.files,
        req.body.channel
    );

    res.status(201).json({
        success: true,
        data: message,
    });
});

const getWorkspaceMessages = asyncHandler(async (req, res) => {
    const data = await messageService.getWorkspaceMessages(
        req.params.workspaceId,
        req.user,
        req.query
    );

    res.status(200).json({
        success: true,
        data,
    });
});

module.exports = {
    sendMessage,
    getWorkspaceMessages,
};
