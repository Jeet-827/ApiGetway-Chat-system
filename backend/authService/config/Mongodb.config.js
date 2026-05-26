import mongoose from "mongoose";

export const connect = async () => {
   try {
     if (mongoose.connection.readyState >= 1) return;
     await mongoose.connect(process.env.AUTH_MONGO_URI);
     console.log("✅ Auth MongoDB Connected successfully!");
   } catch (error) {
     console.error("❌ Auth MongoDB Connection Error:", error.message);
     process.exit(1);
   }
};