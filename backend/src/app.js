const express = require("express");
const cors = require("cors");

const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);

// Test Route
app.get("/", (req, res) => {
    res.send("CollabHub API is running...");
});

module.exports = app;