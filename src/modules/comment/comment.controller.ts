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

// get comments
export const getCommentsByReview = async (
  req: Request,
  res: Response
) => {
  const result = await CommentService.getCommentsByReview(
    req.params.reviewId as string
  );

  res.status(200).json({
    success: true,
    data: result,
  });
};


// delete
export const deleteComment = async (
  req: any,
  res: Response
) => {
  const userId = req.user.userId;

  await CommentService.deleteComment(
    userId,
    req.params.id
  );

  res.status(200).json({
    success: true,
    message: "Comment deleted",
  });
};