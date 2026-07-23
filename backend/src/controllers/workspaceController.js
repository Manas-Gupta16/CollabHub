const workspaceService = require("../services/workspaceService");

const asyncHandler = require("../middleware/asyncHandler");

const createWorkspace = asyncHandler(
    async (req, res) => {
        const workspace =
            await workspaceService.createWorkspace(
                req.body,
                req.user
            );

        res.status(201).json({
            success: true,
            data: workspace,
        });
    }
);

const getMyWorkspaces = asyncHandler(
    async (req, res) => {
        const workspaces =
            await workspaceService.getMyWorkspaces(
                req.user
            );

        res.status(200).json({
            success: true,
            data: workspaces,
        });
    }
);

const getWorkspaceById = asyncHandler(
    async (req, res) => {
        const workspace =
            await workspaceService.getWorkspaceById(
                req.params.workspaceId,
                req.user
            );

        res.status(200).json({
            success: true,
            data: workspace,
        });
    }
);

const addMemberToWorkspace = asyncHandler(
    async (req, res) => {
        const workspace =
            await workspaceService.addMemberToWorkspace(
                req.params.workspaceId,
                req.body,
                req.user
            );

        res.status(200).json({
            success: true,
            data: workspace,
        });
    }
);

const updateMemberRole = asyncHandler(
    async (req, res) => {
        const workspace =
            await workspaceService.updateMemberRole(
                req.params.workspaceId,
                req.body.userId,
                req.body.role,
                req.user
            );

        res.status(200).json({
            success: true,
            data: workspace,
        });
    }
);

const getWorkspaceStats = asyncHandler(
    async (req, res) => {
        const stats =
            await workspaceService.getWorkspaceStats(
                req.params.workspaceId,
                req.user
            );

        res.status(200).json({
            success: true,
            data: stats,
        });
    }
);

const createChannel = asyncHandler(
    async (req, res) => {
        const workspace =
            await workspaceService.createChannel(
                req.params.workspaceId,
                req.body,
                req.user
            );

        res.status(201).json({
            success: true,
            data: workspace,
        });
    }
);

const removeMemberFromWorkspace = asyncHandler(
    async (req, res) => {
        const workspace =
            await workspaceService.removeMemberFromWorkspace(
                req.params.workspaceId,
                req.params.userId,
                req.user
            );

        res.status(200).json({
            success: true,
            data: workspace,
        });
    }
);

const deleteChannel = asyncHandler(
    async (req, res) => {
        const workspace =
            await workspaceService.deleteChannel(
                req.params.workspaceId,
                req.params.channelName,
                req.user
            );

        res.status(200).json({
            success: true,
            data: workspace,
        });
    }
);

const addMemberToChannel = asyncHandler(
    async (req, res) => {
        const workspace =
            await workspaceService.addMemberToChannel(
                req.params.workspaceId,
                req.params.channelName,
                req.body.userId,
                req.user
            );

        res.status(200).json({
            success: true,
            data: workspace,
        });
    }
);

const removeMemberFromChannel = asyncHandler(
    async (req, res) => {
        const workspace =
            await workspaceService.removeMemberFromChannel(
                req.params.workspaceId,
                req.params.channelName,
                req.params.userId,
                req.user
            );

        res.status(200).json({
            success: true,
            data: workspace,
        });
    }
);

const updateWorkspace = asyncHandler(async (req, res) => {
    const workspace = await workspaceService.updateWorkspace(
        req.params.workspaceId,
        req.body,
        req.user
    );

    res.status(200).json({
        success: true,
        data: workspace,
    });
});

const addPinnedLink = asyncHandler(async (req, res) => {
    const workspace = await workspaceService.addPinnedLink(
        req.params.workspaceId,
        req.body,
        req.user
    );
    res.status(201).json({ success: true, data: workspace });
});

const deletePinnedLink = asyncHandler(async (req, res) => {
    const workspace = await workspaceService.deletePinnedLink(
        req.params.workspaceId,
        req.params.linkId,
        req.user
    );
    res.status(200).json({ success: true, data: workspace });
});

const addTeamGoal = asyncHandler(async (req, res) => {
    const workspace = await workspaceService.addTeamGoal(
        req.params.workspaceId,
        req.body,
        req.user
    );
    res.status(201).json({ success: true, data: workspace });
});

const toggleTeamGoal = asyncHandler(async (req, res) => {
    const workspace = await workspaceService.toggleTeamGoal(
        req.params.workspaceId,
        req.params.goalId,
        req.user
    );
    res.status(200).json({ success: true, data: workspace });
});

const deleteTeamGoal = asyncHandler(async (req, res) => {
    const workspace = await workspaceService.deleteTeamGoal(
        req.params.workspaceId,
        req.params.goalId,
        req.user
    );
    res.status(200).json({ success: true, data: workspace });
});

module.exports = {
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
    addPinnedLink,
    deletePinnedLink,
    addTeamGoal,
    toggleTeamGoal,
    deleteTeamGoal,
};