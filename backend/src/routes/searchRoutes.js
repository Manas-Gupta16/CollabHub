const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { globalSearch } = require("../controllers/searchController");

const router = express.Router();

router.use(protect);

router.get("/:workspaceId/search", globalSearch);

module.exports = router;
