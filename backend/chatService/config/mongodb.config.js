import mongoose from "mongoose";

export const connect = async () => {
    try {
        if (mongoose.connection.readyState >= 1) return;
        await mongoose.connect(process.env.CHAT_MONGO_URI);
        console.log("✅ Chat MongoDB connected successfully");
    } catch (error) {
        console.error("❌ Chat MongoDB Connection Error:", error.message);
        process.exit(1);
    }
};