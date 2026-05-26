import express from "express";
import dotenv from "dotenv";
import { createProxyMiddleware } from "http-proxy-middleware";
import cors from "cors";
import { Server } from "socket.io";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:5173";
const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || "http://localhost:5001";
const CHAT_SERVICE_URL = process.env.CHAT_SERVICE_URL || "http://localhost:5002";

app.use(
  cors({
    origin: CORS_ORIGIN,
    credentials: true,
  })
);

// Proxy configuration with error handling (CORS is preserved)
const apiProxy = createProxyMiddleware({
  target: AUTH_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: {
    '^/api': '' 
  },
  onError: (err, req, res) => {
    console.error("Gateway proxy to Auth Service failed:", err.message);
    res.status(503).json({ message: "Auth Service temporarily unavailable" });
  }
});

const wsProxy = createProxyMiddleware({
  target: CHAT_SERVICE_URL,
  changeOrigin: true,
  ws: false, // Let Gateway handle the raw socket connections itself
  pathRewrite: {
    '^/socket': ''
  },
  onError: (err, req, res) => {
    console.error("Gateway proxy to Chat Service failed:", err.message);
    res.status(503).json({ message: "Chat Service temporarily unavailable" });
  }
});

app.use('/api', apiProxy);
app.use('/socket', wsProxy);

// Basic health check route
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("API Gateway error:", err.message);
  res.status(500).json({ message: "Internal Gateway Error" });
});

// Start HTTP server
const server = app.listen(PORT, () => {
  console.log(`🚀 API Gateway running on port ${PORT}`);
});

// Instantiate Socket.IO directly inside the Gateway on port 8000!
const io = new Server(server, {
  path: "/socket.io",
  cors: {
    origin: CORS_ORIGIN,
    credentials: true
  }
});

const users = {};

io.on("connection", (socket) => {
  console.log("User Connected directly to Gateway socket:", socket.id);

  socket.on("register", (userId) => {
    if (!userId) return;
    users[userId] = socket.id;
    socket.userId = userId;
    console.log(`User registered on Gateway: ${userId} with socket ID: ${socket.id}`);
  });

  socket.on("message", (data) => {
    const { senderId, reciveId, message } = data;
    if (!senderId || !reciveId || !message) return;

    // Forward message to the receiver in real-time
    const receiverSocketId = users[reciveId];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("receive-message", {
        senderId,
        message
      });
      console.log(`Real-time message forwarded from ${senderId} to ${reciveId}`);
    }
  });

  socket.on("disconnect", () => {
    if (socket.userId && users[socket.userId]) {
      console.log(`User disconnected from Gateway: ${socket.userId}`);
      delete users[socket.userId];
    }
  });
});
