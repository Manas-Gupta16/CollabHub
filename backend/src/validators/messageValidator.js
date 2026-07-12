const { body } = require("express-validator");

const messageValidator = [
    body("content")
        .trim()
        .notEmpty()
        .withMessage("Message content is required"),
];

module.exports = {
    messageValidator,
};
