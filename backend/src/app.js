const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const swaggerUi = require(
    "swagger-ui-express"
);

const swaggerSpec = require(
    "./docs/swagger"
);

const {
    errorHandler,
} = require(
    "./middleware/errorMiddleware"
);

const logger = require(
    "./middleware/loggerMiddleware"
);

const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const workspaceRoutes = require("./routes/workspaceRoutes");
const taskRoutes = require("./routes/taskRoutes");
const activityRoutes = require("./routes/activityRoutes");
const commentRoutes = require("./routes/commentRoutes");
const messageRoutes = require("./routes/messageRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const searchRoutes = require("./routes/searchRoutes");

const apiLimiter = require(
    "./middleware/rateLimiter"
);



const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve uploads statically
const path = require("path");
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));


app.use(logger);

app.use(helmet());
app.use(apiLimiter);

// Routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/workspaces", workspaceRoutes);
app.use("/api", taskRoutes);
app.use("/api/workspaces", activityRoutes);
app.use("/api", commentRoutes);
app.use("/api/workspaces", messageRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/workspaces", searchRoutes);

// Test Route
app.get("/", (req, res) => {
    res.send("CollabHub API is running...");
});

app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec)
);

app.use(errorHandler);

module.exports = app;