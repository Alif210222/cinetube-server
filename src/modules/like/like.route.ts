import express from "express";
import * as LikeController from "./like.controller";
import { auth } from "../../middlewares/auth.middleware";

const likeRoutes = express.Router();

// toggle like
likeRoutes.post("/:reviewId", auth("USER"), LikeController.toggleLike);

// get total likes
likeRoutes.get("/:reviewId", LikeController.getLikesCount);

export default likeRoutes;