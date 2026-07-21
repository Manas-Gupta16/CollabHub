const Task = require("../models/Task");
const Message = require("../models/Message");
const Comment = require("../models/Comment");
const Workspace = require("../models/Workspace");
const AppError = require("../utils/AppError");

const globalSearch = async (workspaceId, query, currentUser) => {
    if (!query) {
        return { tasks: [], messages: [], comments: [] };
    }

    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) {
        throw new AppError("Workspace not found", 404);
    }

    const isMember = workspace.members.some(
        (member) => member.user.toString() === currentUser._id.toString() && member.status !== "PENDING"
    );

    if (!isMember) {
        throw new AppError("You are not a member of this workspace", 403);
    }

    const escapedQuery = query.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(escapedQuery, "i");

    const [tasks, messages, comments] = await Promise.all([
        Task.find({
            workspace: workspaceId,
            $or: [{ title: regex }, { description: regex }],
        }).select("title description status priority createdAt"),
        
        Message.find({
            workspace: workspaceId,
            content: regex,
        }).populate("sender", "name"),

        Comment.find({
            content: regex,
        })
        .populate({
            path: "task",
            match: { workspace: workspaceId }, 
            select: "title"
        })
        .populate("user", "name")
    ]);

    const validComments = comments.filter(c => c.task != null);

    return {
        tasks,
        messages,
        comments: validComments,
    };
};

module.exports = {
    globalSearch,
};
