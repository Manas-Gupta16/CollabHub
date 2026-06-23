const activityService = require(
    "../services/activityService"
);
const asyncHandler = require("../middleware/asyncHandler");

const getWorkspaceActivities = asyncHandler(
    async (req, res) => {
        const activities =
            await activityService.getWorkspaceActivities(
                req.params.workspaceId,
                req.user
            );

        res.status(200).json({
            success: true,
            data: activities,
        });
    }
);

module.exports = {
    getWorkspaceActivities,
};