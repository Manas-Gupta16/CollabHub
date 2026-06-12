const Task = require("../models/Task");
const Workspace = require("../models/Workspace");
const User = require("../models/User");

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

const assignTask = async (
    taskId,
    assigneeId,
    currentUser
) => {
    const task = await Task.findById(taskId);

    if (!task) {
        throw new Error("Task not found");
    }

    const workspace = await Workspace.findById(
        task.workspace
    );

    const currentMember =
        workspace.members.find(
            (member) =>
                member.user.toString() ===
                currentUser._id.toString()
        );

    if (!currentMember) {
        throw new Error(
            "You are not a member of this workspace"
        );
    }

    const assignee = await User.findById(
        assigneeId
    );

    if (!assignee) {
        throw new Error("User not found");
    }

    const isWorkspaceMember =
        workspace.members.some(
            (member) =>
                member.user.toString() ===
                assigneeId.toString()
        );

    if (!isWorkspaceMember) {
        throw new Error(
            "User is not a workspace member"
        );
    }

    task.assignee = assigneeId;

    await task.save();

    return task;
};

module.exports = {
    createTask,
    getWorkspaceTasks,
    assignTask,
};