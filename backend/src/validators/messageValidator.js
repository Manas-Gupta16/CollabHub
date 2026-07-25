const { body } = require("express-validator");

const messageValidator = [
    body("content")
        .custom((value, { req }) => {
            const hasContent = value && value.trim().length > 0;
            const hasFiles = (req.files && req.files.length > 0) || (req.file);
            if (!hasContent && !hasFiles) {
                throw new Error("Message content or file attachment is required");
            }
            return true;
        }),
];

module.exports = {
    messageValidator,
};
