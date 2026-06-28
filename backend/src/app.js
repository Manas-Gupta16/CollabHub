const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

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

const apiLimiter = require(
    "./middleware/rateLimiter"
);



const app = express();

// Middleware
app.use(cors());
app.use(express.json());


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

// Test Route
app.get("/", (req, res) => {
    res.send("CollabHub API is running...");
});

app.use(errorHandler);

module.exports = app;