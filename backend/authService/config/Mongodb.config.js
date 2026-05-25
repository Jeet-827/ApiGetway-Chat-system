import mongoose from "mongoose";

export const connect = ()=>{
   try {
    const conn = mongoose.connect(process.env.AUTH_MONGO_URI)
    console.log("the mongodb Connect")
   } catch (error) {
    console.log(error)
   }
}