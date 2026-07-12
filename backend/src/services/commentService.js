const AppError = require("../utils/AppError");
const Comment = require("../models/Comment");
const Task = require("../models/Task");
const Workspace = require("../models/Workspace");

const activityService = require("./activityService");
const notificationService = require("./notificationService");

const {
    ACTIVITY_ACTIONS,
} = require("../constants/activityConstants");

const addComment = async (
    taskId,
    content,
    currentUser
) => {
    const task =
        await Task.findById(taskId);

    if (!task) {
        throw new AppError(
            "Task not found",
            404
        );
    }

    const workspace =
        await Workspace.findById(
            task.workspace
        );

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

    const comment =
        await Comment.create({
            task: taskId,
            user: currentUser._id,
            content,
        });

    await activityService.createActivity({
        workspace: workspace._id,
        user: currentUser._id,
        action:
            ACTIVITY_ACTIONS.TASK_COMMENTED,
        details: `Commented on task: ${task.title}`,
    });

    if (task.assignee && task.assignee.toString() !== currentUser._id.toString()) {
        await notificationService.createNotification({
            recipientId: task.assignee,
            type: "NEW_COMMENT",
            message: `${currentUser.name} commented on your task: ${task.title}`,
            workspaceId: workspace._id,
            relatedEntityId: task._id
        });
    }

    return comment;
};

const getTaskComments = async (
    taskId,
    currentUser
) => {
    const task =
        await Task.findById(taskId);

    if (!task) {
        throw new AppError(
            "Task not found",
            404
        );
    }

    const workspace =
        await Workspace.findById(
            task.workspace
        );

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

    const comments =
        await Comment.find({
            task: taskId,
        })
            .populate(
                "user",
                "name email"
            )
            .sort({
                createdAt: -1,
            });

    return comments;
};

module.exports = {
    addComment,
    getTaskComments,
};