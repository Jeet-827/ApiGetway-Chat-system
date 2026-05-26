import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
    senderId: {
        type: String,
        required: [true, "senderId is required"],
        index: true
    },
    reciverId: {
        type: String,
        required: [true, "reciverId is required"],
        index: true
    },
    message: {
        type: String,
        required: [true, "message is required"],
        maxlength: [5000, "Message too long"]
    }
}, { timestamps: true });

// Compound index for fast conversation lookups
chatSchema.index({ senderId: 1, reciverId: 1, createdAt: 1 });

export const chatModel = mongoose.model('chat', chatSchema);