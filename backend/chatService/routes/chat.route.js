import { Router } from "express";
import { getChat, sendMessage } from "../controller/chat.controller.js";
import { verify } from "../middleware/Verify.js";

const chatRoute = Router();

chatRoute.get("/messages/:senderId/:receiverId", verify, getChat);
chatRoute.post("/send", sendMessage);

export default chatRoute;