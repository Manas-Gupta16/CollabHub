const request = require("supertest");
const app = require("../src/app");
const User = require("../src/models/User");
const Notification = require("../src/models/Notification");

jest.mock("../src/socket", () => {
    const emit = jest.fn();
    const to = jest.fn(() => ({ emit }));
    return {
        getIO: jest.fn(() => ({ to })),
    };
});

describe("Notification Routes", () => {
    let token1, token2;
    let user1, user2;
    let workspaceId, taskId;

    beforeEach(async () => {
        await request(app).post("/api/auth/register").send({ name: "User 1", email: "user1@example.com", password: "password" });
        await request(app).post("/api/auth/register").send({ name: "User 2", email: "user2@example.com", password: "password" });

        user1 = await User.findOne({ email: "user1@example.com" });
        user2 = await User.findOne({ email: "user2@example.com" });

        const res1 = await request(app).post("/api/auth/login").send({ email: "user1@example.com", password: "password" });
        token1 = res1.body.data.token;

        const res2 = await request(app).post("/api/auth/login").send({ email: "user2@example.com", password: "password" });
        token2 = res2.body.data.token;

        // User 1 creates workspace
        const wsRes = await request(app).post("/api/workspaces").set("Authorization", `Bearer ${token1}`).send({ name: "Test WS" });
        workspaceId = wsRes.body.data._id;

        // User 1 adds User 2
        await request(app).post(`/api/workspaces/${workspaceId}/members`).set("Authorization", `Bearer ${token1}`).send({ email: "user2@example.com", role: "MEMBER" });

        // User 1 creates Task
        const taskRes = await request(app).post(`/api/workspaces/${workspaceId}/tasks`).set("Authorization", `Bearer ${token1}`).send({ title: "Task 1", status: "TODO", priority: "LOW" });
        taskId = taskRes.body.data._id;

        // Clear automatic invitation notifications for isolated testing
        await Notification.deleteMany({});
    });

    test("1. Assign Task creates Notification for assignee", async () => {
        // User 1 assigns User 2
        await request(app)
            .patch(`/api/tasks/${taskId}/assign`)
            .set("Authorization", `Bearer ${token1}`)
            .send({ assigneeId: user2._id });

        const notifications = await Notification.find({ recipient: user2._id, type: "TASK_ASSIGNED" });
        expect(notifications.length).toBe(1);
        expect(notifications[0].type).toBe("TASK_ASSIGNED");
    });

    test("2. Get Notifications", async () => {
        // Create manual notification
        await Notification.create({ recipient: user2._id, type: "NEW_COMMENT", message: "Test", workspace: workspaceId });

        const res = await request(app).get("/api/notifications").set("Authorization", `Bearer ${token2}`);
        expect(res.status).toBe(200);
        expect(res.body.data.length).toBe(1);
        expect(res.body.data[0].message).toBe("Test");
    });

    test("3. Mark Notification as Read", async () => {
        const notif = await Notification.create({ recipient: user2._id, type: "NEW_COMMENT", message: "Test", workspace: workspaceId });
        const res = await request(app).patch(`/api/notifications/${notif._id}/read`).set("Authorization", `Bearer ${token2}`);
        expect(res.status).toBe(200);
        expect(res.body.data.isRead).toBe(true);
    });

    test("4. Mark All Notifications as Read", async () => {
        await Notification.create({ recipient: user2._id, type: "NEW_COMMENT", message: "Test 1", workspace: workspaceId });
        await Notification.create({ recipient: user2._id, type: "NEW_COMMENT", message: "Test 2", workspace: workspaceId });

        const res = await request(app).patch(`/api/notifications/read-all`).set("Authorization", `Bearer ${token2}`);
        expect(res.status).toBe(200);

        const unread = await Notification.find({ recipient: user2._id, isRead: false });
        expect(unread.length).toBe(0);
    });
});
