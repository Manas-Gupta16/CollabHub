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

        test("6. Update Task Status - Fail (Task not found)", async () => {
            const fakeId = "507f1f77bcf86cd799439011";
            const response = await request(app)
                .patch(`/api/tasks/${fakeId}/status`)
                .set("Authorization", `Bearer ${token}`)
                .send({ status: "DONE" });
            
            expect(response.status).toBe(404);
        });

        test("7. Assign Task - Fail (User not member)", async () => {
            // Create user 2
            await request(app).post("/api/auth/register").send({ name: "User2", email: "u2@example.com", password: "password" });
            const res2 = await request(app).post("/api/auth/login").send({ email: "u2@example.com", password: "password" });
            const user2Token = res2.body.data.token;
            const u2 = await User.findOne({ email: "u2@example.com" });

            const response = await request(app)
                .patch(`/api/tasks/${taskId}/assign`)
                .set("Authorization", `Bearer ${token}`)
                .send({ assigneeId: u2._id });
            
            expect(response.status).toBe(400); // Because User is not a workspace member
        });

        test("8. Assign Task - Success", async () => {
            // Create user 2
            await request(app).post("/api/auth/register").send({ name: "User2", email: "u2@example.com", password: "password" });
            const u2 = await User.findOne({ email: "u2@example.com" });
            
            // Add user2 to workspace first
            await request(app)
                .post(`/api/workspaces/${workspaceId}/members`)
                .set("Authorization", `Bearer ${token}`)
                .send({ email: "u2@example.com", role: "MEMBER" });

            const response = await request(app)
                .patch(`/api/tasks/${taskId}/assign`)
                .set("Authorization", `Bearer ${token}`)
                .send({ assigneeId: u2._id });
            
            expect(response.status).toBe(200);
            expect(response.body.data.assignee.toString()).toBe(u2._id.toString());
        });

        test("9. Delete Task - Fail (Not owner/admin)", async () => {
            // Create user 3
            await request(app).post("/api/auth/register").send({ name: "User3", email: "u3@example.com", password: "password" });
            
            // Add user3 to workspace as MEMBER
            await request(app)
                .post(`/api/workspaces/${workspaceId}/members`)
                .set("Authorization", `Bearer ${token}`)
                .send({ email: "u3@example.com", role: "MEMBER" });

            // User 3 tries to delete task
            const res2 = await request(app).post("/api/auth/login").send({ email: "u3@example.com", password: "password" });
            const user2Token = res2.body.data.token;

            const response = await request(app)
                .delete(`/api/tasks/${taskId}`)
                .set("Authorization", `Bearer ${user2Token}`);
            
            expect(response.status).toBe(403);
            expect(response.body.message).toBe("Only owners and admins can delete tasks");
        });
    });

    test("10. Create Task - Fail (Workspace not found)", async () => {
        const fakeId = "507f1f77bcf86cd799439011";
        const response = await request(app)
            .post(`/api/workspaces/${fakeId}/tasks`)
            .set("Authorization", `Bearer ${token}`)
            .send({ title: "Test Task" });
        
        expect(response.status).toBe(404);
    });

    test("11. Get Tasks with Filters", async () => {
        const response = await request(app)
            .get(`/api/workspaces/${workspaceId}/tasks?search=Test&status=TODO&sortBy=dueDate&page=1&limit=5`)
            .set("Authorization", `Bearer ${token}`);
        
        expect(response.status).toBe(200);
        expect(response.body.data).toHaveProperty("pagination");
    });
});