const request = require("supertest");
const app = require("../src/app");
const User = require("../src/models/User");

// Mock Socket.io
jest.mock("../src/socket", () => {
    const emit = jest.fn();
    const to = jest.fn(() => ({ emit }));
    return {
        getIO: jest.fn(() => ({ to })),
    };
});

describe("Search Routes", () => {
    let token1;
    let workspaceId, taskId;

    beforeEach(async () => {
        await request(app).post("/api/auth/register").send({ name: "User 1", email: "user1@example.com", password: "password" });
        const res1 = await request(app).post("/api/auth/login").send({ email: "user1@example.com", password: "password" });
        token1 = res1.body.data.token;

        const wsRes = await request(app).post("/api/workspaces").set("Authorization", `Bearer ${token1}`).send({ name: "Test WS" });
        workspaceId = wsRes.body.data._id;

        const taskRes = await request(app).post(`/api/workspaces/${workspaceId}/tasks`).set("Authorization", `Bearer ${token1}`).send({ title: "UniqueTaskTitle", description: "This is a search test", status: "TODO", priority: "LOW" });
        taskId = taskRes.body.data._id;

        await request(app).post(`/api/workspaces/${workspaceId}/messages`).set("Authorization", `Bearer ${token1}`).send({ content: "UniqueMessageContent" });
        await request(app).post(`/api/tasks/${taskId}/comments`).set("Authorization", `Bearer ${token1}`).send({ content: "UniqueCommentContent" });
    });

    test("1. Global Search - Find Task", async () => {
        const res = await request(app).get(`/api/workspaces/${workspaceId}/search?q=UniqueTask`).set("Authorization", `Bearer ${token1}`);
        expect(res.status).toBe(200);
        expect(res.body.data.tasks.length).toBe(1);
        expect(res.body.data.tasks[0].title).toBe("UniqueTaskTitle");
        expect(res.body.data.messages.length).toBe(0);
        expect(res.body.data.comments.length).toBe(0);
    });

    test("2. Global Search - Find Message", async () => {
        const res = await request(app).get(`/api/workspaces/${workspaceId}/search?q=UniqueMessage`).set("Authorization", `Bearer ${token1}`);
        expect(res.status).toBe(200);
        expect(res.body.data.messages.length).toBe(1);
    });

    test("3. Global Search - Find Comment", async () => {
        const res = await request(app).get(`/api/workspaces/${workspaceId}/search?q=UniqueComment`).set("Authorization", `Bearer ${token1}`);
        expect(res.status).toBe(200);
        expect(res.body.data.comments.length).toBe(1);
    });

    test("4. Global Search - Unauthorized", async () => {
        await request(app).post("/api/auth/register").send({ name: "User 2", email: "user2@example.com", password: "password" });
        const res2 = await request(app).post("/api/auth/login").send({ email: "user2@example.com", password: "password" });
        const token2 = res2.body.data.token;

        const res = await request(app).get(`/api/workspaces/${workspaceId}/search?q=Unique`).set("Authorization", `Bearer ${token2}`);
        expect(res.status).toBe(403);
    });
});
