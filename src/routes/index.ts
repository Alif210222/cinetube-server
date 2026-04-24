
import express, { Router } from "express";
import authRoutes from "../modules/auth/auth.route";
import movieRoutes from "../modules/movie/movie.route";
import reviewRoutes from "../modules/review/review.route";
import commentRoutes from "../modules/comment/comment.route";
import likeRoutes from "../modules/like/like.route";
import watchListRoutes from "../modules/watchList/watchList.route";
import paymentRoutes from "../modules/payment/payment.route";
import subRoutes from "../modules/subscription/sub.route";
import userRoute from "../modules/user/user.route";


const routes = Router()

routes.use("/auth", authRoutes)
routes.use("/user",userRoute)
routes.use("/movie", movieRoutes)
routes.use("/review", reviewRoutes)
routes.use("/comment", commentRoutes)
routes.use("/like",likeRoutes)
routes.use("/watchList",watchListRoutes)
routes.use("/payment", paymentRoutes)
routes.use("/subscription", subRoutes)

      

export default routes;