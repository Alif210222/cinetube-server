import { Request, Response } from "express";
import * as ReviewService from "./review.service";

// ✅ Create Review
export const createReview = async (req: any, res: Response) => {
  const userId = req.user.userId;

  const result = await ReviewService.createReview(
    userId,
    req.body
  );

  res.status(201).json({
    success: true,
    message: "Review submitted for approval",
    data: result,
  });
};

// ✅ Get Reviews
export const getReviews = async (req: Request, res: Response) => {
  const result = await ReviewService.getReviews(req.query);

  res.status(200).json({
    success: true,
    data: result,
  });
};

// ✅ Update Review
export const updateReview = async (req: any, res: Response) => {
  const userId = req.user.userId;

  const result = await ReviewService.updateReview(
    userId,
    req.params.id as string,
    req.body
  );

  res.status(200).json({
    success: true,
    message: "Review updated",
    data: result,
  });
};

// ✅ Delete Review
export const deleteReview = async (req: any, res: Response) => {
  const userId = req.user.userId;

  await ReviewService.deleteReview(userId, req.params.id);

  res.status(200).json({
    success: true,
    message: "Review deleted",
  });
};

// ✅ Admin Approve
export const approveReview = async (req: Request, res: Response) => {
  const result = await ReviewService.approveReview(
    req.params.id as string
  );

  res.status(200).json({
    success: true,
    message: "Review approved",
    data: result,
  });
};