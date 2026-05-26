
import dotenv from "dotenv"
dotenv.config()

import express from "express";
import AuthRoute from "./routes/Auth.route.js";
import { connect } from "./config/Mongodb.config.js";
import cookieParser from "cookie-parser";
import userRoute from "./routes/Users.route.js";

const app = express();
connect()
// app.use(cors({    origin: "http://localhost:5173",credentials:true}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())
app.use('/auth',AuthRoute)
app.use('/getuser',userRoute)




app.listen(process.env.PORT || 5001, () => {
  console.log("Server running on port ",process.env.PORT);
});