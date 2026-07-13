const request = require("supertest");
const app = require("../src/app");
const User = require("../src/models/User");

describe("User Routes", () => {
    beforeEach(async () => {
        await User.deleteMany({});
    });

    test("1. Create User - Success", async () => {
        const response = await request(app)
            .post("/api/users")
            .send({
                name: "Test User",
                email: "test@example.com",
                password: "password123",
            });

        expect(response.status).toBe(201);
        expect(response.body.success).toBe(true);
        expect(response.body.data).toHaveProperty("name", "Test User");
        expect(response.body.data).toHaveProperty("email", "test@example.com");
    });

    test("2. Create User - Fail (User already exists)", async () => {
        await request(app)
            .post("/api/users")
            .send({
                name: "Test User",
                email: "test@example.com",
                password: "password123",
            });

        const response = await request(app)
            .post("/api/users")
            .send({
                name: "Another User",
                email: "test@example.com",
                password: "password456",
            });

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe("User already exists");
    });
});
