import express from "express";
import * as UserController from "./user.controller";
import { auth } from "../../middlewares/auth.middleware";

const userRoute = express.Router();

// admin only
userRoute.get("/",UserController.getAllUsers);

export default userRoute;