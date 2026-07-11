const dotenv = require("dotenv");

// Load Environment Variables
dotenv.config();

require("./config/env");

const http = require("http");
const app = require("./app");
const connectDB = require("./config/db");
const { initSocket } = require("./socket");

// Connect Database
connectDB();

const server = http.createServer(app);

// Initialize Socket.io
const io = initSocket(server);
app.set("io", io);

const PORT = process.env.PORT || 5000;

// Start Server
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});