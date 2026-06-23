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

module.exports = {
    createWorkspace,
    getMyWorkspaces,
    getWorkspaceById,
    addMemberToWorkspace,
    updateMemberRole,
    getWorkspaceStats,
};