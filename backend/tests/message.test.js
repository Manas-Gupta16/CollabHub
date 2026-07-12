const request = require("supertest");
const app = require("../src/app");
const User = require("../src/models/User");

// Mock Socket.io
jest.mock("../src/socket", () => {
    const emit = jest.fn();
    const to = jest.fn(() => ({ emit }));
    return {
        getIO: jest.fn(() => ({ to })),
        mockEmit: emit,
        mockTo: to,
    };
});

describe("Message Routes", () => {
    let token1, token2;
    let user1, user2;
    let workspaceId;

    beforeEach(async () => {
        // Register and login users
        await request(app).post("/api/auth/register").send({ name: "User 1", email: "user1@example.com", password: "password" });
        await request(app).post("/api/auth/register").send({ name: "User 2", email: "user2@example.com", password: "password" });

        user1 = await User.findOne({ email: "user1@example.com" });
        user2 = await User.findOne({ email: "user2@example.com" });

        const res1 = await request(app).post("/api/auth/login").send({ email: "user1@example.com", password: "password" });
        token1 = res1.body.data.token;

        const res2 = await request(app).post("/api/auth/login").send({ email: "user2@example.com", password: "password" });
        token2 = res2.body.data.token;

        // Create workspace with user1
        const workspaceRes = await request(app)
            .post("/api/workspaces")
            .set("Authorization", `Bearer ${token1}`)
            .send({ name: "Test Workspace" });
        
        workspaceId = workspaceRes.body.data._id;
    });

    describe("POST /api/workspaces/:workspaceId/messages", () => {
        test("1. Send Message - Success", async () => {
            const response = await request(app)
                .post(`/api/workspaces/${workspaceId}/messages`)
                .set("Authorization", `Bearer ${token1}`)
                .send({ content: "Hello team!" });

            expect(response.status).toBe(201);
            expect(response.body.success).toBe(true);
            expect(response.body.data.content).toBe("Hello team!");
        });

        test("2. Send Message - Fail (Not a member)", async () => {
            const response = await request(app)
                .post(`/api/workspaces/${workspaceId}/messages`)
                .set("Authorization", `Bearer ${token2}`)
                .send({ content: "Sneaking in!" });

            expect(response.status).toBe(403);
            expect(response.body.success).toBe(false);
        });
    });

    describe("GET /api/workspaces/:workspaceId/messages", () => {
        beforeEach(async () => {
            await request(app)
                .post(`/api/workspaces/${workspaceId}/messages`)
                .set("Authorization", `Bearer ${token1}`)
                .send({ content: "First message" });
        });

        test("3. Get Messages - Success", async () => {
            const response = await request(app)
                .get(`/api/workspaces/${workspaceId}/messages`)
                .set("Authorization", `Bearer ${token1}`);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.messages.length).toBe(1);
            expect(response.body.data.messages[0].content).toBe("First message");
        });

        test("4. Get Messages - Fail (Not a member)", async () => {
            const response = await request(app)
                .get(`/api/workspaces/${workspaceId}/messages`)
                .set("Authorization", `Bearer ${token2}`);

            expect(response.status).toBe(403);
            expect(response.body.success).toBe(false);
        });
    });
});
