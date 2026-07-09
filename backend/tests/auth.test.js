const request = require("supertest");
const app = require("../src/app");
const User = require("../src/models/User");

describe("Auth Routes", () => {
    const testUser = {
        name: "Test User",
        email: "test@example.com",
        password: "password123",
    };

    describe("POST /api/auth/register", () => {
        test("1. Register - Success", async () => {
            const response = await request(app)
                .post("/api/auth/register")
                .send(testUser);
            expect(response.status).toBe(201);
            expect(response.body.success).toBe(true);
            expect(response.body.data).toHaveProperty("email", testUser.email);
            
            const userInDb = await User.findOne({ email: testUser.email });
            expect(userInDb).toBeTruthy();
        });

        test("2. Register - Fail (Missing fields)", async () => {
            const response = await request(app)
                .post("/api/auth/register")
                .send({ email: "test2@example.com" });
            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
        });

        test("3. Register - Fail (Duplicate email)", async () => {
            await request(app).post("/api/auth/register").send(testUser);
            
            const response = await request(app)
                .post("/api/auth/register")
                .send(testUser);
            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
        });
    });

    describe("POST /api/auth/login", () => {
        beforeEach(async () => {
            await request(app).post("/api/auth/register").send(testUser);
        });

        test("4. Login - Success", async () => {
            const response = await request(app)
                .post("/api/auth/login")
                .send({ email: testUser.email, password: testUser.password });
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data).toHaveProperty("token");
        });

        test("5. Login - Fail (Wrong password)", async () => {
            const response = await request(app)
                .post("/api/auth/login")
                .send({ email: testUser.email, password: "wrongpassword" });
            expect(response.status).toBe(401);
            expect(response.body.success).toBe(false);
        });

        test("6. Login - Fail (Non-existent user)", async () => {
            const response = await request(app)
                .post("/api/auth/login")
                .send({ email: "notfound@example.com", password: "password123" });
            expect(response.status).toBe(401);
            expect(response.body.success).toBe(false);
        });
    });

    describe("GET /api/auth/profile", () => {
        let token;

        beforeEach(async () => {
            await request(app).post("/api/auth/register").send(testUser);
            const res = await request(app)
                .post("/api/auth/login")
                .send({ email: testUser.email, password: testUser.password });
            token = res.body.data.token;
        });

        test("7. Get Profile - Success", async () => {
            const response = await request(app)
                .get("/api/auth/profile")
                .set("Authorization", `Bearer ${token}`);
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.user).toHaveProperty("email", testUser.email);
        });

        test("8. Get Profile - Fail (Unauthenticated/Missing token)", async () => {
            const response = await request(app).get("/api/auth/profile");
            expect(response.status).toBe(401);
            expect(response.body.success).toBe(false);
        });

        test("9. Get Profile - Fail (Invalid token)", async () => {
            const response = await request(app)
                .get("/api/auth/profile")
                .set("Authorization", "Bearer invalidtoken");
            expect(response.status).toBe(401);
            expect(response.body.success).toBe(false);
        });
    });
});