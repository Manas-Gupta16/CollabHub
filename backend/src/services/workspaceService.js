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
                status: "ACTIVE",
            },
        ],
        channels: [
            { name: "General", isPrivate: false },
            { name: "Announcements", isPrivate: false }
        ],
        pinnedLinks: [
            { title: "CollabHub Docs", url: "https://link.com/CollabHub/1" }
        ],
        keyDeadlines: [
            { title: "Project Launch", date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) } // 7 days from now
        ],
        teamGoals: [
            { title: "Complete design system", isCompleted: true },
            { title: "Setup API routes", isCompleted: false }
        ]
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
        members: {
            $elemMatch: {
                user: currentUser._id,
                status: { $ne: "PENDING" }
            }
        }
    }).populate("members.user", "name email profileImage");

    for (const ws of workspaces) {
        let hasGeneral = false;
        for (const c of ws.channels) {
            if (c.name.toLowerCase() === "general") {
                c.name = "General";
                hasGeneral = true;
            }
        }
        if (!hasGeneral) {
            ws.channels.unshift({ name: "General", isPrivate: false });
        }
        await ws.save();
    }

    return workspaces;
};

const getWorkspaceById = async (
    workspaceId,
    currentUser
) => {
    const workspace = await Workspace.findById(
        workspaceId
    ).populate("members.user", "name email profileImage");

    if (!workspace) {
        throw new AppError(
            "Workspace not found",
            404
        );
    }

    const isMember = workspace.members.some(
        (member) =>
            (member.user._id || member.user).toString() ===
            currentUser._id.toString() && member.status !== "PENDING"
    );

    if (!isMember) {
        throw new AppError(
            "You are not authorized to access this workspace",
            403
        );
    }

    let hasGeneral = false;
    for (const c of workspace.channels) {
        if (c.name.toLowerCase() === "general") {
            c.name = "General";
            hasGeneral = true;
        }
    }
    if (!hasGeneral) {
        workspace.channels.unshift({ name: "General", isPrivate: false });
    }
    await workspace.save();

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

    const existingMember = workspace.members.find(
        (member) =>
            member.user.toString() ===
            user._id.toString()
    );

    if (existingMember) {
        if (existingMember.status === "PENDING") {
            throw new AppError(
                "User has already been invited to this workspace",
                400
            );
        } else {
            throw new AppError(
                "User is already a member of this workspace",
                400
            );
        }
    }

    workspace.members.push({
        user: user._id,
        role: role || ROLES.MEMBER,
        status: "PENDING",
    });

    await workspace.save();

    // Create invitation notification
    const notificationService = require("./notificationService");
    await notificationService.createNotification({
        recipientId: user._id,
        type: "WORKSPACE_INVITATION",
        message: `${currentUser.name} invited you to join workspace "${workspace.name}"`,
        workspaceId: workspace._id,
        relatedEntityId: workspace._id
    });

    await activityService.createActivity({
        workspace: workspace._id,
        user: currentUser._id,
        action:
            ACTIVITY_ACTIONS.MEMBER_ADDED,
        details: `Invited ${user.email} as ${role || ROLES.MEMBER}`,
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
                currentUser._id.toString() && member.status !== "PENDING"
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
                userId.toString() && member.status !== "PENDING"
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
                currentUser._id.toString() && member.status !== "PENDING"
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

const createChannel = async (workspaceId, channelData, currentUser) => {
    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) {
        throw new AppError("Workspace not found", 404);
    }

    const currentMember = workspace.members.find(
        (member) => member.user.toString() === currentUser._id.toString() && member.status !== "PENDING"
    );

    if (!currentMember) {
        throw new AppError("You are not a member of this workspace", 403);
    }

    // Only Owner and Admin can create channels
    if (currentMember.role !== "OWNER" && currentMember.role !== "ADMIN") {
        throw new AppError("Only owners and admins can create channels", 403);
    }

    const { name, isPrivate } = channelData;

    // Check duplicate channel name
    const channelExists = workspace.channels.some(
        (c) => c.name.toLowerCase() === name.toLowerCase()
    );
    if (channelExists) {
        throw new AppError("Channel name already exists in this workspace", 400);
    }

    workspace.channels.push({ name, isPrivate: !!isPrivate });
    await workspace.save();

    await activityService.createActivity({
        workspace: workspace._id,
        user: currentUser._id,
        action: ACTIVITY_ACTIONS.CHANNEL_CREATED || "CHANNEL_CREATED",
        details: `Created channel: #${name}`,
    });

    return workspace;
};

module.exports = {
    createWorkspace,
    getMyWorkspaces,
    getWorkspaceById,
    addMemberToWorkspace,
    updateMemberRole,
    getWorkspaceStats,
    createChannel,
};

const removeMemberFromWorkspace = async (workspaceId, userId, currentUser) => {
    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) {
        throw new AppError("Workspace not found", 404);
    }

    const currentMember = workspace.members.find(
        (member) => member.user.toString() === currentUser._id.toString() && member.status !== "PENDING"
    );

    if (!currentMember || currentMember.role !== "OWNER") {
        throw new AppError("Only workspace owners can remove members", 403);
    }

    if (userId.toString() === workspace.owner.toString()) {
        throw new AppError("Owner cannot be removed from the workspace", 400);
    }

    const memberExists = workspace.members.some(
        (member) => member.user.toString() === userId.toString()
    );

    if (!memberExists) {
        throw new AppError("Member not found in workspace", 404);
    }

    workspace.members = workspace.members.filter(
        (member) => member.user.toString() !== userId.toString()
    );

    await workspace.save();

    await activityService.createActivity({
        workspace: workspace._id,
        user: currentUser._id,
        action: "MEMBER_REMOVED",
        details: `Removed member from workspace`,
    });

    return workspace;
};

const deleteChannel = async (workspaceId, channelName, currentUser) => {
    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) {
        throw new AppError("Workspace not found", 404);
    }

    const currentMember = workspace.members.find(
        (member) => member.user.toString() === currentUser._id.toString() && member.status !== "PENDING"
    );

    if (!currentMember) {
        throw new AppError("You are not a member of this workspace", 403);
    }

    if (currentMember.role !== "OWNER" && currentMember.role !== "ADMIN") {
        throw new AppError("Only owners and admins can delete channels", 403);
    }

    if (channelName.toLowerCase() === "general") {
        throw new AppError("The general channel cannot be deleted", 400);
    }

    const channelIndex = workspace.channels.findIndex(
        (c) => c.name.toLowerCase() === channelName.toLowerCase()
    );

    if (channelIndex === -1) {
        throw new AppError("Channel not found", 404);
    }

    workspace.channels.splice(channelIndex, 1);
    await workspace.save();

    await activityService.createActivity({
        workspace: workspace._id,
        user: currentUser._id,
        action: "CHANNEL_DELETED",
        details: `Deleted channel: #${channelName}`,
    });

    return workspace;
};

module.exports = {
    createWorkspace,
    getMyWorkspaces,
    getWorkspaceById,
    addMemberToWorkspace,
    updateMemberRole,
    getWorkspaceStats,
    createChannel,
    removeMemberFromWorkspace,
    deleteChannel,
};