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

module.exports = {
    createWorkspaceValidator,
    addMemberValidator,
};