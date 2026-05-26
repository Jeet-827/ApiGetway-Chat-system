import { chatModel } from "../model/chatmodel.js";

export const getChat = async (req, res) => {
    try {
        const { senderId, receiverId } = req.params;

        if (!senderId || !receiverId) {
            return res.status(400).json({ message: "senderId and receiverId are required", status: 400 });
        }

        const messages = await chatModel.find({
            $or: [
                { senderId: senderId, reciverId: receiverId },
                { senderId: receiverId, reciverId: senderId }
            ]
        }).sort({ createdAt: 1 }).lean();

        return res.json(messages);

    } catch (error) {
        console.error("getChat error:", error.message);
        return res.status(500).json({ message: "Failed to fetch messages", status: 500 });
    }
};

export const sendMessage = async (req, res) => {
    try {
        const { senderId, reciverId, message } = req.body;

        if (!senderId || !reciverId || !message) {
            return res.status(400).json({ 
                success: false, 
                message: "senderId, reciverId and message are required" 
            });
        }

        if (message.length > 5000) {
            return res.status(400).json({ 
                success: false, 
                message: "Message too long (max 5000 characters)" 
            });
        }

        const saved = await chatModel.create({ senderId, reciverId, message });

        return res.status(201).json({ success: true, data: { _id: saved._id } });

    } catch (err) {
        console.error("sendMessage error:", err.message);
        return res.status(500).json({ success: false, message: "Failed to save message" });
    }
};