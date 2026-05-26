import { createServer } from "node:http";
import express from "express";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import { connect } from "./config/mongodb.config.js";
import chatRoute from "./routes/chat.route.js";

dotenv.config();
const app = express();

app.use(cors({
  origin: process.env.CORS_ORIGIN || "http://localhost:5173",
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/chat', chatRoute);

const server = createServer(app);

const io = new Server(server, {
  path: "/socket/socket.io",
  cors: {
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
  },
});

// Map of userId -> socket.id
const onlineUsers = {};

io.on("connection", (socket) => {
  console.log("User Connected to socket:", socket.id);

  socket.on("register", (userId) => {
    if (!userId) return;
    onlineUsers[userId] = socket.id;
    socket.userId = userId;
    console.log(`User registered: ${userId} with socket: ${socket.id}`);
    
    // Broadcast updated online users list
    io.emit("online-users", Object.keys(onlineUsers));
  });

  socket.on("message", async (data) => {
    const { senderId, reciveId, message } = data;
    if (!senderId || !reciveId || !message) return;

    // Forward message to receiver in real-time
    const receiverSocketId = onlineUsers[reciveId];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("receive-message", {
        senderId,
        message
      });
    }
  });

  // Typing status event
  socket.on("typing", (data) => {
    const { senderId, reciveId, isTyping } = data;
    if (!senderId || !reciveId) return;

    const receiverSocketId = onlineUsers[reciveId];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("typing-status", {
        senderId,
        isTyping
      });
    }
  });

  socket.on("disconnect", () => {
    if (socket.userId && onlineUsers[socket.userId]) {
      console.log(`User disconnected: ${socket.userId}`);
      delete onlineUsers[socket.userId];
      // Broadcast updated online users list
      io.emit("online-users", Object.keys(onlineUsers));
    }
  });
});

// Connect to MongoDB first, then start server
async function startServer() {
  await connect();
  
  const PORT = process.env.PORT || 5002;
  server.listen(PORT, () => {
    console.log(`🚀 Chat Service running on port ${PORT}`);
  });
}

startServer();