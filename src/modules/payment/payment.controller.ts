import { Response } from "express";
import * as PaymentService from "./payment.service";




export const buyMovie = async (
  req: any,
  res: Response
) => {
  const userId = req.user.userId;
  const movieId = req.params.movieId;

  const result =
    await PaymentService.buyMovie(
      userId,
      movieId
    );

  res.json({
    success: true,
    url: result.url,
  });
};


// get purchase movies for a user
export const checkMovieAccess = async (
  req: any,
  res: Response
) => {
  const userId = req.user.userId;
  const movieId = req.params.movieId;

  const result =
    await PaymentService.checkMovieAccess(
      userId,
      movieId
    );

  res.json({
    success: true,
    purchased: result,
  });
};



export const stripeWebhook = async (
  req: any,
  res: Response
) => {
  const sig =
    req.headers["stripe-signature"];

  const result =
    await PaymentService.handleWebhook(
      req.body,
      sig
    );

  res.json({ received: true });
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