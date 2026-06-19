const workspaceService = require("../services/workspaceService");

const createWorkspace = async (req, res) => {
    try {
        const workspace =
            await workspaceService.createWorkspace(
                req.body,
                req.user
            );

        res.status(201).json({
            success: true,
            data: workspace,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

const getMyWorkspaces = async (req, res) => {
    try {
        const workspaces =
            await workspaceService.getMyWorkspaces(
                req.user
            );

        res.status(200).json({
            success: true,
            data: workspaces,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const getWorkspaceById = async (req, res) => {
    try {
        const workspace =
            await workspaceService.getWorkspaceById(
                req.params.id,
                req.user
            );

        res.status(200).json({
            success: true,
            data: workspace,
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message,
        });
    }
};

const addMemberToWorkspace = async (req, res) => {
    try {
        const workspace =
            await workspaceService.addMemberToWorkspace(
                req.params.id,
                req.body,
                req.user
            );

        res.status(200).json({
            success: true,
            data: workspace,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

const updateMemberRole = async (
    req,
    res
) => {
    try {
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
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    createWorkspace,
    getMyWorkspaces,
    getWorkspaceById,
    addMemberToWorkspace,
    updateMemberRole,
};