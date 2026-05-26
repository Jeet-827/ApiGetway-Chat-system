import { Router } from "express";
import { verify } from "../middleware/verify.js";
import { getAllUser } from "../controller/user.controller.js";
    const userRoute = Router()
    userRoute.get('/users',verify,getAllUser)

    export default userRoute