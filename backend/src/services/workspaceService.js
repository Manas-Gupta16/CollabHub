const Workspace = require("../models/Workspace");
const User = require("../models/User");
const ROLES = require("../constants/roles");
const Task = require("../models/Task");

const AppError = require(
    "../utils/AppError"
);

const activityService = require("./activityService");

const {
    ACTIVITY_ACTIONS,
} = require("../constants/activityConstants");

const createWorkspace = async (
    workspaceData,
    currentUser
) => {
    const { name, description } = workspaceData;

    const workspace = await Workspace.create({
        name,
        description,

        owner: currentUser._id,

        members: [
            {
                user: currentUser._id,
                role: ROLES.OWNER,
            },
        ],
    });

    await activityService.createActivity({
        workspace: workspace._id,
        user: currentUser._id,
        action:
            ACTIVITY_ACTIONS.WORKSPACE_CREATED,
        details: `Created workspace: ${workspace.name}`,
    });

    return workspace;
};

const getMyWorkspaces = async (
    currentUser
) => {
    const workspaces = await Workspace.find({
        "members.user": currentUser._id,
    });

    return workspaces;
};

const getWorkspaceById = async (
    workspaceId,
    currentUser
) => {
    const workspace = await Workspace.findById(
        workspaceId
    );

    if (!workspace) {
        throw new AppError(
            "Workspace not found",
            404
        );
    }

    const isMember = workspace.members.some(
        (member) =>
            member.user.toString() ===
            currentUser._id.toString()
    );

    if (!isMember) {
        throw new AppError(
            "You are not authorized to access this workspace",
            403
        );
    }

    return workspace;
};

const addMemberToWorkspace = async (
    workspaceId,
    memberData,
    currentUser
) => {
    const { email, role } = memberData;

    const workspace = await Workspace.findById(
        workspaceId
    );

    if (!workspace) {
        throw new AppError(
            "Workspace not found",
            404
        );
    }

    const ownerMember = workspace.members.find(
        (member) =>
            member.user.toString() ===
            currentUser._id.toString()
    );

    if (
        !ownerMember ||
        ownerMember.role !== ROLES.OWNER
    ) {
        throw new AppError(
            "Only workspace owner can add members",
            403
        );
    }

    const user = await User.findOne({
        email,
    });

    if (!user) {
        throw new AppError(
            "User not found",
            404
        );
    }

    const alreadyMember =
        workspace.members.some(
            (member) =>
                member.user.toString() ===
                user._id.toString()
        );

    if (alreadyMember) {
        throw new AppError(
            "User is already a workspace member",
            400
        );
    }

    workspace.members.push({
        user: user._id,
        role: role || ROLES.MEMBER,
    });

    await workspace.save();

    await activityService.createActivity({
        workspace: workspace._id,
        user: currentUser._id,
        action:
            ACTIVITY_ACTIONS.MEMBER_ADDED,
        details: `Added ${user.email} as ${role || ROLES.MEMBER
            }`,
    });

    return workspace;
};

const updateMemberRole = async (
    workspaceId,
    userId,
    role,
    currentUser
) => {
    const workspace =
        await Workspace.findById(
            workspaceId
        );

    if (!workspace) {
        throw new AppError(
            "Workspace not found",
            404
        );
    }

    const ownerMember =
        workspace.members.find(
            (member) =>
                member.user.toString() ===
                currentUser._id.toString()
        );

    if (
        !ownerMember ||
        ownerMember.role !== ROLES.OWNER
    ) {
        throw new AppError(
            "Only workspace owner can update roles",
            403
        );
    }

    const targetMember =
        workspace.members.find(
            (member) =>
                member.user.toString() ===
                userId.toString()
        );

    if (!targetMember) {
        throw new AppError(
            "Member not found",
            404
        );
    }

    if (
        targetMember.role ===
        ROLES.OWNER
    ) {
        throw new AppError(
            "Owner role cannot be changed",
            400
        );
    }

    if (
        role !== ROLES.ADMIN &&
        role !== ROLES.MEMBER
    ) {
        throw new AppError(
            "Invalid role",
            400
        );
    }

    targetMember.role = role;

    await workspace.save();

    await activityService.createActivity({
        workspace: workspace._id,
        user: currentUser._id,
        action:
            ACTIVITY_ACTIONS.ROLE_UPDATED,
        details: `Updated member role to ${role}`,
    });

    return workspace;
};


const getWorkspaceStats = async (
    workspaceId,
    currentUser
) => {
    const workspace =
        await Workspace.findById(
            workspaceId
        );

    if (!workspace) {
        throw new AppError(
            "Workspace not found",
            404
        );
    }

    const isMember =
        workspace.members.some(
            (member) =>
                member.user.toString() ===
                currentUser._id.toString()
        );

    if (!isMember) {
        throw new AppError(
            "You are not a member of this workspace",
            403
        );
    }

    const totalTasks =
        await Task.countDocuments({
            workspace: workspaceId,
        });

    const todoTasks =
        await Task.countDocuments({
            workspace: workspaceId,
            status: "TODO",
        });

    const inProgressTasks =
        await Task.countDocuments({
            workspace: workspaceId,
            status: "IN_PROGRESS",
        });

    const doneTasks =
        await Task.countDocuments({
            workspace: workspaceId,
            status: "DONE",
        });

    const totalMembers =
        workspace.members.length;

    const highPriorityTasks =
        await Task.countDocuments({
            workspace: workspaceId,
            priority: "HIGH",
        });

    const mediumPriorityTasks =
        await Task.countDocuments({
            workspace: workspaceId,
            priority: "MEDIUM",
        });

    const lowPriorityTasks =
        await Task.countDocuments({
            workspace: workspaceId,
            priority: "LOW",
        });

    const completionRate =
        totalTasks === 0
            ? 0
            : Math.round(
                (doneTasks / totalTasks) * 100
            );

    const assignedTasks =
        await Task.countDocuments({
            workspace: workspaceId,
            assignee: currentUser._id,
        });

    const overdueTasks =
        await Task.countDocuments({
            workspace: workspaceId,
            dueDate: {
                $lt: new Date(),
            },
            status: {
                $ne: "DONE",
            },
        });

    return {
        totalTasks,
        todoTasks,
        inProgressTasks,
        doneTasks,

        highPriorityTasks,
        mediumPriorityTasks,
        lowPriorityTasks,

        totalMembers,

        completionRate,

        assignedTasks,
        overdueTasks,
    };
};

module.exports = {
    createWorkspace,
    getMyWorkspaces,
    getWorkspaceById,
    addMemberToWorkspace,
    updateMemberRole,
    getWorkspaceStats,
};