
import express from "express";
// import cors from "cors";
import AuthRoute from "./routes/Auth.route.js";
import dotenv from "dotenv"
import { connect } from "./config/Mongodb.config.js";

const app = express();
dotenv.config()
connect()
// app.use(cors({    origin: "http://localhost:5173",credentials:true}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/auth',AuthRoute)




app.listen(process.env.PORT || 5001, () => {
  console.log("Server running on port ",process.env.PORT);
});