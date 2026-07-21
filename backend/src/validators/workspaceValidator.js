const { body } = require("express-validator");

const createWorkspaceValidator = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage(
            "Workspace name is required"
        ),
];

const addMemberValidator = [
    body("email")
        .isEmail()
        .withMessage(
            "Valid email is required"
        ),

    body("role")
        .optional()
        .isIn([
            "OWNER",
            "ADMIN",
            "MEMBER",
        ])
        .withMessage("Invalid role"),
];

const createChannelValidator = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Channel name is required")
        .isLength({ min: 2, max: 30 })
        .withMessage("Channel name must be between 2 and 30 characters")
        .matches(/^[a-zA-Z0-9_-]+$/)
        .withMessage("Channel name can only contain letters, numbers, hyphens, and underscores"),
];

module.exports = {
    createWorkspaceValidator,
    addMemberValidator,
    createChannelValidator,
};