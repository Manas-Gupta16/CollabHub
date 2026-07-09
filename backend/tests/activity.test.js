const request = require("supertest");
const app = require("../src/app");
const User = require("../src/models/User");

describe("Activity Routes", () => {
    let token;
    let workspaceId;

    beforeEach(async () => {
        await request(app).post("/api/auth/register").send({ name: "User", email: "user@example.com", password: "password" });
        const res = await request(app).post("/api/auth/login").send({ email: "user@example.com", password: "password" });
        token = res.body.data.token;

        const workspaceRes = await request(app)
            .post("/api/workspaces")
            .set("Authorization", `Bearer ${token}`)
            .send({ name: "Test Workspace" });
        workspaceId = workspaceRes.body.data._id;
    });

    test("1. Get Workspace Activity - Success", async () => {
        await request(app)
            .post(`/api/workspaces/${workspaceId}/tasks`)
            .set("Authorization", `Bearer ${token}`)
            .send({ title: "Test Task" });

        const response = await request(app)
            .get(`/api/workspaces/${workspaceId}/activity`)
            .set("Authorization", `Bearer ${token}`);
        
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(Array.isArray(response.body.data)).toBe(true);
    });
});
