import { Request, Response } from "express";
import * as CommentService from "./comment.service";

// create
export const createComment = async (req: any, res: Response) => {
  const userId = req.user.userId;

  const result = await CommentService.createComment(
    userId,
    req.body
  );

  res.status(201).json({
    success: true,
    message: "Comment added successfully",
    data: result,
  });
};