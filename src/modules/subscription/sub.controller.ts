import { Response } from "express";
import * as SubService from "./sub.service";

export const getMySubscription =
async (req: any, res: Response) => {
  const result =
    await SubService.getMySubscription(
      req.user.userId
    );

  res.json({
    success: true,
    data: result,
  });
};

export const cancelSubscription =
async (req: any, res: Response) => {
  await SubService.cancelSubscription(
    req.user.userId
  );

  res.json({
    success: true,
    message:
      "Subscription cancelled",
  });
};