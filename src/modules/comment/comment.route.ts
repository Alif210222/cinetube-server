import express from "express";
import * as CommentController from "./comment.controller";
import { auth } from "../../middlewares/auth.middleware";

const commentRoutes = express.Router();

// create comment / reply
commentRoutes.post("/", auth("USER", "ADMIN"), CommentController.createComment);

// get comments by review
commentRoutes.get("/:reviewId", CommentController.getCommentsByReview);

// delete own comment
commentRoutes.delete("/:id", auth("USER", "ADMIN"), CommentController.deleteComment);

export default commentRoutes;