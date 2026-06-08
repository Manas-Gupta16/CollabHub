const Workspace = require("../models/Workspace");

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
                role: "OWNER",
            },
        ],
    });

    return workspace;
};

const getMyWorkspaces = async (currentUser) => {
    const workspaces = await Workspace.find({
        "members.user": currentUser._id,
    });

    return workspaces;
};

module.exports = {
    createWorkspace,
    getMyWorkspaces,
};