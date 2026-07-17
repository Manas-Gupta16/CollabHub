const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
    sendMessage,
    getWorkspaceMessages,
} = require("../controllers/messageController");
const validate = require("../middleware/validationMiddleware");
const { messageValidator } = require("../validators/messageValidator");

const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

router.use(protect);

router
    .route("/:workspaceId/messages")
    .post(upload.array("attachments", 5), messageValidator, validate, sendMessage)
    .get(getWorkspaceMessages);

module.exports = router;
