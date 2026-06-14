const Task = require("../models/Task");
const Workspace = require("../models/Workspace");
const User = require("../models/User");
const activityService = require("./activityService");

const {
    ACTIVITY_ACTIONS,
} = require("../constants/activityConstants");

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

    await activityService.createActivity({
        workspace: workspaceId,
        user: currentUser._id,
        action:
            ACTIVITY_ACTIONS.TASK_CREATED,
        details: `Created task: ${task.title}`,
    });

    return task;
};

const getWorkspaceTasks = async (
    workspaceId,
    currentUser,
    filters
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

    const query = {
        workspace: workspaceId,
    };

    if (filters.status) {
        query.status = filters.status;
    }

    if (filters.priority) {
        query.priority = filters.priority;
    }

    if (filters.assignee) {
        query.assignee = filters.assignee;
    }

    const tasks = await Task.find(query)
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

    if (
        currentMember.role !== "OWNER" &&
        currentMember.role !== "ADMIN"
    ) {
        throw new Error(
            "Only owners and admins can assign tasks"
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

    await activityService.createActivity({
        workspace: workspace._id,
        user: currentUser._id,
        action:
            ACTIVITY_ACTIONS.TASK_ASSIGNED,
        details: `Assigned task: ${task.title}`,
    });

    return task;
};

const updateTaskStatus = async (
    taskId,
    status,
    currentUser
) => {
    const task = await Task.findById(taskId);

    if (!task) {
        throw new Error("Task not found");
    }

    const workspace = await Workspace.findById(
        task.workspace
    );

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

    task.status = status;

    await task.save();

    await activityService.createActivity({
        workspace: workspace._id,
        user: currentUser._id,
        action:
            ACTIVITY_ACTIONS.TASK_STATUS_UPDATED,
        details: `Updated task "${task.title}" to ${status}`,
    });

    return task;
};

module.exports = {
    createTask,
    getWorkspaceTasks,
    assignTask,
    updateTaskStatus,
};