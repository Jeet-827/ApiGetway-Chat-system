import { createServer } from "node:http";
import express from "express";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv"
const app = express();
dotenv.config()
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const server = createServer(app);

const io = new Server(server, {
  path: "/socket/socket.io",
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("User Connected:", socket.id);

});

server.listen(process.env.PORT || 5002, () => {
  console.log("Server running on port 5000",process.env.PORT);
});