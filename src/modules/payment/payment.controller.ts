import { Response } from "express";
import * as PaymentService from "./payment.service";

export const createCheckoutSession = async (
  req: any,
  res: Response
) => {
  const userId = req.user.userId;

  const result =
    await PaymentService.createCheckoutSession(
      userId,
      req.body.plan
    );

  res.status(200).json({
    success: true,
    url: result.url,
  });
};

export const getPaymentHistory = async (
  req: any,
  res: Response
) => {
  const result =
    await PaymentService.getPaymentHistory(
      req.user.userId
    );

  res.json({
    success: true,
    data: result,
  });
};