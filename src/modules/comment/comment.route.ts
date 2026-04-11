import express from "express";
import * as CommentController from "./comment.controller";
import { auth } from "../../middlewares/auth.middleware";

const router = express.Router();

// create comment / reply
router.post("/", auth("USER", "ADMIN"), CommentController.createComment);

export default router;