
import express, { Router } from "express";
import authRoutes from "../modules/auth/auth.route";


const routes = Router()

routes.use("/auth", authRoutes)


export default routes;