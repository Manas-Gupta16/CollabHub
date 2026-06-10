const Task = require("../models/Task");
const Workspace = require("../models/Workspace");

const createTask = async (
    workspaceId,
    taskData,
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
            "You are not a member of this workspace"
        );
    }

    const task = await Task.create({
        title: taskData.title,
        description: taskData.description,
        priority: taskData.priority,
        dueDate: taskData.dueDate,

        workspace: workspaceId,
        createdBy: currentUser._id,
    });

    return task;
};

const getWorkspaceTasks = async (
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
            "You are not a member of this workspace"
        );
    }

    const tasks = await Task.find({
        workspace: workspaceId,
    })
        .populate(
            "createdBy",
            "name email"
        )
        .populate(
            "assignee",
            "name email"
        );

    return tasks;
};

module.exports = {
    createTask,
    getWorkspaceTasks,
};