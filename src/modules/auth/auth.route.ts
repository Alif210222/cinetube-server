import express, { Router } from "express";
import {register,
  login,
  refreshToken,
  logout,
} from "./auth.controller";

const authRoutes = Router();

authRoutes.post("/register", register);
authRoutes.post("/login", login);
authRoutes.post("/refresh-token", refreshToken);
authRoutes.post("/logout", logout);

export default authRoutes;