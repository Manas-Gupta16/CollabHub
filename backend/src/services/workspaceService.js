const Workspace = require("../models/Workspace");
const User = require("../models/User");
const ROLES = require("../constants/roles");

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
        throw new Error("Workspace not found");
    }

    const isMember = workspace.members.some(
        (member) =>
            member.user.toString() ===
            currentUser._id.toString()
    );

    if (!isMember) {
        throw new Error(
            "You are not authorized to access this workspace"
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
        throw new Error("Workspace not found");
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
        throw new Error(
            "Only workspace owner can add members"
        );
    }

    const user = await User.findOne({
        email,
    });

    if (!user) {
        throw new Error("User not found");
    }

    const alreadyMember =
        workspace.members.some(
            (member) =>
                member.user.toString() ===
                user._id.toString()
        );

    if (alreadyMember) {
        throw new Error(
            "User is already a workspace member"
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

module.exports = {
    createWorkspace,
    getMyWorkspaces,
    getWorkspaceById,
    addMemberToWorkspace,
};