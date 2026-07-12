const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const User = require("./models/User");

let io;

const initSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: "*", // Allow all origins for now, can be restricted to frontend URL later
            methods: ["GET", "POST"]
        }
    });

    // Socket Authentication Middleware
    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.auth.token;

            if (!token) {
                return next(new Error("Authentication error: Token missing"));
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.id).select("-password");

            if (!user) {
                return next(new Error("Authentication error: User not found"));
            }

            socket.user = user;
            next();
        } catch (err) {
            return next(new Error("Authentication error: Invalid token"));
        }
    });

    io.on("connection", (socket) => {
        console.log(`User connected via socket: ${socket.user.name} (${socket.id})`);

        // Automatically join a room named after the user's ID for direct messages/notifications
        socket.join(socket.user._id.toString());

        // Join a specific workspace room
        socket.on("join_workspace", (workspaceId) => {
            socket.join(workspaceId);
            console.log(`User ${socket.user.name} joined workspace room: ${workspaceId}`);
        });

        // Leave a specific workspace room
        socket.on("leave_workspace", (workspaceId) => {
            socket.leave(workspaceId);
            console.log(`User ${socket.user.name} left workspace room: ${workspaceId}`);
        });

        socket.on("disconnect", () => {
            console.log(`User disconnected via socket: ${socket.user.name} (${socket.id})`);
        });
    });

    return io;
};

const getIO = () => {
    if (!io) {
        throw new Error("Socket.io not initialized!");
    }
    return io;
};

module.exports = { initSocket, getIO };
