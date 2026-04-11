import { Request, Response } from "express";
import * as LikeService from "./like.service";

// toggle
export const toggleLike = async (
  req: any,
  res: Response
) => {
  const userId = req.user.userId;

  const result = await LikeService.toggleLike(
    userId,
    req.params.reviewId as string
  );

  res.status(200).json({
    success: true,
    message: result.message,
  });
};

// count
export const getLikesCount = async (
  req: Request,
  res: Response
) => {
  const result = await LikeService.getLikesCount(
    req.params.reviewId as string
  );

  res.status(200).json({
    success: true,
    totalLikes: result,
  });
};