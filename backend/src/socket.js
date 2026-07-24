const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const User = require("./models/User");

let io;
// Track active socket connections per user ID
const userSocketsMap = new Map(); // userId string -> Set of socket IDs

const getOnlineUserIds = () => Array.from(userSocketsMap.keys());

const initSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: "*",
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
        const userIdStr = socket.user._id.toString();
        console.log(`User connected via socket: ${socket.user.name} (${socket.id})`);

        if (!userSocketsMap.has(userIdStr)) {
            userSocketsMap.set(userIdStr, new Set());
        }
        userSocketsMap.get(userIdStr).add(socket.id);

        // Join room for direct notifications
        socket.join(userIdStr);

        // Broadcast current online user list to all connected clients
        io.emit("online_users_list", getOnlineUserIds());

        socket.on("get_online_users", () => {
            socket.emit("online_users_list", getOnlineUserIds());
        });

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
            if (userSocketsMap.has(userIdStr)) {
                const userSockets = userSocketsMap.get(userIdStr);
                userSockets.delete(socket.id);
                if (userSockets.size === 0) {
                    userSocketsMap.delete(userIdStr);
                }
            }
            io.emit("online_users_list", getOnlineUserIds());
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

module.exports = { initSocket, getIO, getOnlineUserIds };
