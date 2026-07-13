const request = require("supertest");
const app = require("../src/app");
const User = require("../src/models/User");

describe("Workspace Routes", () => {
    let token1, token2;
    let user1, user2;
    let workspaceId;

    beforeEach(async () => {
        await request(app).post("/api/auth/register").send({ name: "User 1", email: "user1@example.com", password: "password" });
        await request(app).post("/api/auth/register").send({ name: "User 2", email: "user2@example.com", password: "password" });
        
        user1 = await User.findOne({ email: "user1@example.com" });
        user2 = await User.findOne({ email: "user2@example.com" });

        const res1 = await request(app).post("/api/auth/login").send({ email: "user1@example.com", password: "password" });
        token1 = res1.body.data.token;

        const res2 = await request(app).post("/api/auth/login").send({ email: "user2@example.com", password: "password" });
        token2 = res2.body.data.token;
    });

    test("1. Create Workspace - Success", async () => {
        const response = await request(app)
            .post("/api/workspaces")
            .set("Authorization", `Bearer ${token1}`)
            .send({ name: "Test Workspace", description: "A test workspace" });
        
        expect(response.status).toBe(201);
        expect(response.body.success).toBe(true);
        expect(response.body.data).toHaveProperty("name", "Test Workspace");
    });

    test("2. Create Workspace - Fail (Missing name)", async () => {
        const response = await request(app)
            .post("/api/workspaces")
            .set("Authorization", `Bearer ${token1}`)
            .send({ description: "Missing name" });
        
        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
    });

    test("3. Get Workspaces - Success", async () => {
        await request(app)
            .post("/api/workspaces")
            .set("Authorization", `Bearer ${token1}`)
            .send({ name: "Test Workspace" });

        const response = await request(app)
            .get("/api/workspaces")
            .set("Authorization", `Bearer ${token1}`);
        
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data.length).toBeGreaterThan(0);
    });

    describe("Workspace Member Roles", () => {
        beforeEach(async () => {
            const res = await request(app)
                .post("/api/workspaces")
                .set("Authorization", `Bearer ${token1}`)
                .send({ name: "Test Workspace" });
            workspaceId = res.body.data._id;
            
            await request(app)
                .post(`/api/workspaces/${workspaceId}/members`)
                .set("Authorization", `Bearer ${token1}`)
                .send({ email: "user2@example.com", role: "MEMBER" });
        });

        test("4. Update Member Role - Success", async () => {
            const response = await request(app)
                .patch(`/api/workspaces/${workspaceId}/members/role`)
                .set("Authorization", `Bearer ${token1}`)
                .send({ userId: user2._id, role: "ADMIN" });
            
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            
            const updatedMember = response.body.data.members.find(m => m.user.toString() === user2._id.toString());
            expect(updatedMember.role).toBe("ADMIN");
        });

        test("5. Update Member Role - Fail (Non-owner gets 403 Forbidden)", async () => {
            const response = await request(app)
                .patch(`/api/workspaces/${workspaceId}/members/role`)
                .set("Authorization", `Bearer ${token2}`)
                .send({ userId: user2._id, role: "ADMIN" });
            
            expect(response.status).toBe(403);
            expect(response.body.success).toBe(false);
        });

        test("6. Add Member - Fail (User not found)", async () => {
            const response = await request(app)
                .post(`/api/workspaces/${workspaceId}/members`)
                .set("Authorization", `Bearer ${token1}`)
                .send({ email: "notfound@example.com", role: "MEMBER" });
            
            expect(response.status).toBe(404);
            expect(response.body.message).toBe("User not found");
        });

        test("7. Add Member - Fail (Already a member)", async () => {
            const response = await request(app)
                .post(`/api/workspaces/${workspaceId}/members`)
                .set("Authorization", `Bearer ${token1}`)
                .send({ email: "user2@example.com", role: "MEMBER" });
            
            expect(response.status).toBe(400);
            expect(response.body.message).toBe("User is already a workspace member");
        });

        test("8. Update Role - Fail (Owner role cannot be changed)", async () => {
            const response = await request(app)
                .patch(`/api/workspaces/${workspaceId}/members/role`)
                .set("Authorization", `Bearer ${token1}`)
                .send({ userId: user1._id, role: "ADMIN" });
            
            expect(response.status).toBe(400);
            expect(response.body.message).toBe("Owner role cannot be changed");
        });

        test("9. Update Role - Fail (Invalid role)", async () => {
            const response = await request(app)
                .patch(`/api/workspaces/${workspaceId}/members/role`)
                .set("Authorization", `Bearer ${token1}`)
                .send({ userId: user2._id, role: "SUPERMAN" });
            
            expect(response.status).toBe(400);
        });

        test("10. Get Workspace By ID - Success", async () => {
            const response = await request(app)
                .get(`/api/workspaces/${workspaceId}`)
                .set("Authorization", `Bearer ${token1}`);
            
            expect(response.status).toBe(200);
            expect(response.body.data._id.toString()).toBe(workspaceId.toString());
        });

        test("11. Get Workspace By ID - Fail (Not a member)", async () => {
            await request(app).post("/api/auth/register").send({ name: "User 3", email: "user3@example.com", password: "password" });
            const res3 = await request(app).post("/api/auth/login").send({ email: "user3@example.com", password: "password" });
            const token3 = res3.body.data.token;

            const response = await request(app)
                .get(`/api/workspaces/${workspaceId}`)
                .set("Authorization", `Bearer ${token3}`);
            
            expect(response.status).toBe(403);
            expect(response.body.message).toBe("You are not authorized to access this workspace");
        });

        test("12. Get Workspace Stats - Success", async () => {
            const response = await request(app)
                .get(`/api/workspaces/${workspaceId}/stats`)
                .set("Authorization", `Bearer ${token1}`);
            
            expect(response.status).toBe(200);
            expect(response.body.data).toHaveProperty("totalTasks");
            expect(response.body.data).toHaveProperty("totalMembers");
        });
    });
});