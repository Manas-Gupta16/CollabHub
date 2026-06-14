const Activity = require("../models/Activity");

const Workspace = require(
    "../models/Workspace"
);

const getWorkspaceActivities =
    async (
        workspaceId,
        currentUser
    ) => {
        const workspace =
            await Workspace.findById(
                workspaceId
            );

        if (!workspace) {
            throw new Error(
                "Workspace not found"
            );
        }

        const isMember =
            workspace.members.some(
                (member) =>
                    member.user.toString() ===
                    currentUser._id.toString()
            );

        if (!isMember) {
            throw new Error(
                "You are not a member of this workspace"
            );
        }

        const activities =
            await Activity.find({
                workspace: workspaceId,
            })
                .populate(
                    "user",
                    "name email"
                )
                .sort({
                    createdAt: -1,
                });

        return activities;
    };

const createActivity = async ({
    workspace,
    user,
    action,
    details,
}) => {
    return await Activity.create({
        workspace,
        user,
        action,
        details,
    });
};

module.exports = {
    createActivity,
    getWorkspaceActivities,
};