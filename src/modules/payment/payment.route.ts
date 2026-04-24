import express from "express";
import * as PaymentController from "./payment.controller";
import { auth } from "../../middlewares/auth.middleware";

const paymentRoutes = express.Router();

paymentRoutes.post(
  "/buy-movie/:movieId",
  auth("USER", "ADMIN"),
  PaymentController.buyMovie
);

paymentRoutes.get(
  "/history",
  auth("USER", "ADMIN"),
  PaymentController.getPaymentHistory
);

// NEW => after successful payment, Stripe will send a webhook to this endpoint and we will handle the webhook in the controller.
paymentRoutes.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  PaymentController.stripeWebhook
);

export default paymentRoutes;