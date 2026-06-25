const AppError = require("../utils/AppError");
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
            "You are not a member of this workspace",
            403
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
            "You are not a member of this workspace",
            403
        );
    }

    const query = {
        workspace: workspaceId,
    };

    if (filters.search) {
        query.$or = [
            {
                title: {
                    $regex: filters.search,
                    $options: "i",
                },
            },
            {
                description: {
                    $regex: filters.search,
                    $options: "i",
                },
            },
        ];
    }

    if (filters.status) {
        query.status = filters.status;
    }

    if (filters.priority) {
        query.priority = filters.priority;
    }

    if (filters.assignee) {
        query.assignee = filters.assignee;
    }

    const page =
        parseInt(filters.page) || 1;

    const limit =
        parseInt(filters.limit) || 10;

    const skip =
        (page - 1) * limit;

    let sortOptions = {
        createdAt: -1,
    };

    if (filters.sortBy) {
        if (filters.sortBy === "dueDate") {
            sortOptions = {
                dueDate: 1,
            };
        }

        if (filters.sortBy === "createdAt") {
            sortOptions = {
                createdAt: -1,
            };
        }

        if (filters.sortBy === "priority") {
            sortOptions = {
                priority: 1,
            };
        }
    }

    const totalTasks =
        await Task.countDocuments(query);

    const tasks = await Task.find(query)
        .sort(sortOptions)
        .populate(
            "createdBy",
            "name email"
        )
        .populate(
            "assignee",
            "name email"
        )
        .skip(skip)
        .limit(limit);

    return {
        tasks,
        pagination: {
            totalTasks,
            currentPage: page,
            totalPages: Math.ceil(
                totalTasks / limit
            ),
            limit,
        },
    };
};

const assignTask = async (
    taskId,
    assigneeId,
    currentUser
) => {
    const task = await Task.findById(taskId);

    if (!task) {
        throw new AppError(
            "Task not found",
            404
        );
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
        throw new AppError(
            "You are not a member of this workspace",
            403
        );
    }

    if (
        currentMember.role !== "OWNER" &&
        currentMember.role !== "ADMIN"
    ) {
        throw new AppError(
            "Only owners and admins can assign tasks",
            403
        );
    }

    const assignee = await User.findById(
        assigneeId
    );

    if (!assignee) {
        throw new AppError(
            "User not found",
            404
        );
    }

    const isWorkspaceMember =
        workspace.members.some(
            (member) =>
                member.user.toString() ===
                assigneeId.toString()
        );

    if (!isWorkspaceMember) {
        throw new AppError(
            "User is not a workspace member",
            400
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
        throw new AppError(
            "Task not found",
            404
        );
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
        throw new AppError(
            "You are not a member of this workspace",
            403
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

const updateTask = async (
    taskId,
    taskData,
    currentUser
) => {
    const task = await Task.findById(taskId);

    if (!task) {
        throw new AppError(
            "Task not found",
            404
        );
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
        throw new AppError(
            "You are not a member of this workspace",
            403
        );
    }

    task.title =
        taskData.title || task.title;

    task.description =
        taskData.description ||
        task.description;

    task.priority =
        taskData.priority ||
        task.priority;

    task.dueDate =
        taskData.dueDate ||
        task.dueDate;

    await task.save();

    return task;
};

const deleteTask = async (
    taskId,
    currentUser
) => {
    const task = await Task.findById(taskId);

    if (!task) {
        throw new AppError(
            "Task not found",
            404
        );
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
        throw new AppError(
            "You are not a member of this workspace",
            403
        );
    }

    if (
        currentMember.role !== "OWNER" &&
        currentMember.role !== "ADMIN"
    ) {
        throw new AppError(
            "Only owners and admins can delete tasks",
            403
        );
    }

    await activityService.createActivity({
        workspace: workspace._id,
        user: currentUser._id,
        action:
            ACTIVITY_ACTIONS.TASK_DELETED,
        details: `Deleted task: ${task.title}`,
    });

    await Task.findByIdAndDelete(taskId);

    return {
        message:
            "Task deleted successfully",
    };
};

module.exports = {
    createTask,
    getWorkspaceTasks,
    assignTask,
    updateTaskStatus,
    updateTask,
    deleteTask,
};