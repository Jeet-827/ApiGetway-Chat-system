import { Router } from "express";
import { register, login, refreshAccessToken, logout } from "../controller/Auth.Controller.js";

const AuthRoute = Router();

AuthRoute.post("/register", register);
AuthRoute.post("/login", login);
AuthRoute.post("/refresh", refreshAccessToken);
AuthRoute.post("/logout", logout);

export default AuthRoute;