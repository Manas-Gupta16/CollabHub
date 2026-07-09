const request = require("supertest");
const app = require("../src/app");

describe("Security Tests", () => {
    test("1. Security Headers (Helmet)", async () => {
        const response = await request(app).get("/");
        expect(response.headers).toHaveProperty("x-dns-prefetch-control");
        expect(response.headers["x-powered-by"]).toBeUndefined();
    });

    test("2. Rate Limiting", async () => {
        const response = await request(app).get("/");
        expect(response.status).toBe(200);
        expect(response.headers).toHaveProperty("x-ratelimit-limit");
        expect(response.headers).toHaveProperty("x-ratelimit-remaining");
    });
});
