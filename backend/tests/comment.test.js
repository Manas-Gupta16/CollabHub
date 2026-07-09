const request = require("supertest");
const app = require("../src/app");
const User = require("../src/models/User");

describe("Comment Routes", () => {
    let token;
    let workspaceId;
    let taskId;

    beforeEach(async () => {
        await request(app).post("/api/auth/register").send({ name: "User", email: "user@example.com", password: "password" });
        const res = await request(app).post("/api/auth/login").send({ email: "user@example.com", password: "password" });
        token = res.body.data.token;

        const workspaceRes = await request(app)
            .post("/api/workspaces")
            .set("Authorization", `Bearer ${token}`)
            .send({ name: "Test Workspace" });
        workspaceId = workspaceRes.body.data._id;

        const taskRes = await request(app)
            .post(`/api/workspaces/${workspaceId}/tasks`)
            .set("Authorization", `Bearer ${token}`)
            .send({ title: "Existing Task" });
        taskId = taskRes.body.data._id;
    });

    test("1. Add Comment - Success", async () => {
        const response = await request(app)
            .post(`/api/tasks/${taskId}/comments`)
            .set("Authorization", `Bearer ${token}`)
            .send({ content: "This is a comment" });
        
        expect(response.status).toBe(201);
        expect(response.body.success).toBe(true);
        expect(response.body.data).toHaveProperty("content", "This is a comment");
    });

    test("2. Get Comments - Success", async () => {
        await request(app)
            .post(`/api/tasks/${taskId}/comments`)
            .set("Authorization", `Bearer ${token}`)
            .send({ content: "First comment" });

        const response = await request(app)
            .get(`/api/tasks/${taskId}/comments`)
            .set("Authorization", `Bearer ${token}`);
        
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data.length).toBeGreaterThan(0);
    });
});
