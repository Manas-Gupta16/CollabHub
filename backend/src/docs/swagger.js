const swaggerJSDoc = require("swagger-jsdoc");

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "CollabHub API",
            version: "1.0.0",
            description: "API documentation for CollabHub",
        },
        servers: [
            {
                url: "http://localhost:5000",
                description: "Local server",
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
            schemas: {
                User: {
                    type: "object",
                    properties: {
                        _id: { type: "string", example: "60d0fe4f5311236168a109ca" },
                        name: { type: "string", example: "John Doe" },
                        email: { type: "string", example: "john@example.com" }
                    }
                },
                Workspace: {
                    type: "object",
                    properties: {
                        _id: { type: "string", example: "60d0fe4f5311236168a109ca" },
                        name: { type: "string", example: "Project Alpha" },
                        description: { type: "string", example: "Team collaboration workspace" },
                        members: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    user: { $ref: "#/components/schemas/User" },
                                    role: { type: "string", example: "ADMIN" }
                                }
                            }
                        }
                    }
                },
                Task: {
                    type: "object",
                    properties: {
                        _id: { type: "string", example: "60d0fe4f5311236168a109ca" },
                        title: { type: "string", example: "Design Homepage" },
                        description: { type: "string", example: "Create Figma mockups for homepage" },
                        status: { type: "string", example: "TODO" },
                        priority: { type: "string", example: "HIGH" },
                        workspace: { type: "string", example: "60d0fe4f5311236168a109ca" },
                        assignees: {
                            type: "array",
                            items: { type: "string", example: "60d0fe4f5311236168a109ca" }
                        },
                        dueDate: { type: "string", format: "date-time" },
                        createdAt: { type: "string", format: "date-time" }
                    }
                },
                Comment: {
                    type: "object",
                    properties: {
                        _id: { type: "string", example: "60d0fe4f5311236168a109ca" },
                        content: { type: "string", example: "I have started working on this." },
                        task: { type: "string", example: "60d0fe4f5311236168a109ca" },
                        user: { $ref: "#/components/schemas/User" },
                        createdAt: { type: "string", format: "date-time" }
                    }
                },
                Activity: {
                    type: "object",
                    properties: {
                        _id: { type: "string", example: "60d0fe4f5311236168a109ca" },
                        action: { type: "string", example: "TASK_CREATED" },
                        workspace: { type: "string", example: "60d0fe4f5311236168a109ca" },
                        user: { $ref: "#/components/schemas/User" },
                        details: { type: "object", example: { taskId: "60d0fe4f5311236168a109ca", title: "Design Homepage" } },
                        createdAt: { type: "string", format: "date-time" }
                    }
                }
            }
        },
    },
    apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
