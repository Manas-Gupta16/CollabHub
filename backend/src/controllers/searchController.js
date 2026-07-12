const searchService = require("../services/searchService");
const asyncHandler = require("../middleware/asyncHandler");

const globalSearch = asyncHandler(async (req, res) => {
    const results = await searchService.globalSearch(
        req.params.workspaceId,
        req.query.q,
        req.user
    );

    res.status(200).json({
        success: true,
        data: results,
    });
});

module.exports = { globalSearch };
