const request = require("supertest");
const app = require("../src/app");
const User = require("../src/models/User");

describe("Task Routes", () => {
    let token;
    let user;
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
    });

    test("1. Create Task - Success", async () => {
        const response = await request(app)
            .post(`/api/workspaces/${workspaceId}/tasks`)
            .set("Authorization", `Bearer ${token}`)
            .send({ title: "Test Task", description: "Task desc" });
        
        expect(response.status).toBe(201);
        expect(response.body.success).toBe(true);
        expect(response.body.data).toHaveProperty("title", "Test Task");
    });

    describe("With Existing Task", () => {
        beforeEach(async () => {
            const taskRes = await request(app)
                .post(`/api/workspaces/${workspaceId}/tasks`)
                .set("Authorization", `Bearer ${token}`)
                .send({ title: "Existing Task" });
            taskId = taskRes.body.data._id;
        });

        test("2. Get Tasks - Success", async () => {
            const response = await request(app)
                .get(`/api/workspaces/${workspaceId}/tasks`)
                .set("Authorization", `Bearer ${token}`);
            
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.tasks.length).toBeGreaterThan(0);
        });

        test("3. Update Task - Success", async () => {
            const response = await request(app)
                .patch(`/api/tasks/${taskId}`)
                .set("Authorization", `Bearer ${token}`)
                .send({ title: "Updated Task" });
            
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.title).toBe("Updated Task");
        });

        test("4. Update Task Status - Success", async () => {
            const response = await request(app)
                .patch(`/api/tasks/${taskId}/status`)
                .set("Authorization", `Bearer ${token}`)
                .send({ status: "DONE" });
            
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.status).toBe("DONE");
        });

        test("5. Delete Task - Success", async () => {
            const response = await request(app)
                .delete(`/api/tasks/${taskId}`)
                .set("Authorization", `Bearer ${token}`);
            
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
        });
    });
});