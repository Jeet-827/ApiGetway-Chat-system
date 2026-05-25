import { Router } from "express";
import { register, login } from "../controller/Auth.Controller.js";

const AuthRoute = Router();

AuthRoute.post("/register", register);
AuthRoute.post("/login", login);

export default AuthRoute;