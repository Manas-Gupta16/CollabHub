const { body } = require("express-validator");

const addCommentValidator = [
    body("content")
        .trim()
        .notEmpty()
        .withMessage("Comment content is required")
        .isLength({ max: 1000 })
        .withMessage(
            "Comment cannot exceed 1000 characters"
        ),
];

module.exports = {
    addCommentValidator,
};