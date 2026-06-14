const activityService = require(
    "../services/activityService"
);

const getWorkspaceActivities = async (
    req,
    res
) => {
    try {
        const activities =
            await activityService.getWorkspaceActivities(
                req.params.workspaceId,
                req.user
            );

        res.status(200).json({
            success: true,
            data: activities,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    getWorkspaceActivities,
};