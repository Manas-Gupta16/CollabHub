const { body } = require("express-validator");

const createTaskValidator = [
    body("title")
        .trim()
        .notEmpty()
        .withMessage("Task title is required"),

    body("priority")
        .optional()
        .isIn(["LOW", "MEDIUM", "HIGH"])
        .withMessage("Invalid priority"),
];

const assignTaskValidator = [
    body("assigneeId")
        .notEmpty()
        .withMessage("Assignee ID is required"),
];

const updateStatusValidator = [
    body("status")
        .isIn(["TODO", "IN_PROGRESS", "DONE"])
        .withMessage("Invalid status"),
];

module.exports = {
    createTaskValidator,
    assignTaskValidator,
    updateStatusValidator,
};