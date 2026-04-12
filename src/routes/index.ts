
import express, { Router } from "express";
import authRoutes from "../modules/auth/auth.route";
import movieRoutes from "../modules/movie/movie.route";
import reviewRoutes from "../modules/review/review.route";
import commentRoutes from "../modules/comment/comment.route";
import likeRoutes from "../modules/like/like.route";
import watchListRoutes from "../modules/watchList/watchList.route";


const routes = Router()

routes.use("/auth", authRoutes)
routes.use("/movie", movieRoutes)
routes.use("/review", reviewRoutes)
routes.use("/comment", commentRoutes)
routes.use("/like",likeRoutes)
routes.use("/watchList",watchListRoutes)

      

export default routes;