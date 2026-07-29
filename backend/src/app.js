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

const AppError = require("./utils/AppError");

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
const billingRoutes = require("./routes/billingRoutes");

const apiLimiter = require(
    "./middleware/rateLimiter"
);



const app = express();
app.set("trust proxy", 1);

// Middleware
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Serve uploads statically
const path = require("path");
app.use("/uploads", express.static(path.join(__dirname, "../uploads"), {
    setHeaders: (res) => {
        res.set("Access-Control-Allow-Origin", "*");
        res.set("Cross-Origin-Resource-Policy", "cross-origin");
    }
}));


app.use(logger);

app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(apiLimiter);

// Routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/workspaces", workspaceRoutes);
app.use("/api", taskRoutes);
app.use("/api/workspaces", activityRoutes);
app.use("/api", commentRoutes);
app.use("/api", messageRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/workspaces", searchRoutes);
app.use("/api/billing", billingRoutes);

// Test Route
app.get("/", (req, res) => {
    res.send("CollabHub API is running...");
});

app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec)
);

app.use((req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(errorHandler);

module.exports = app;