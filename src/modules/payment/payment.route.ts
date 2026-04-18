import express from "express";
import * as PaymentController from "./payment.controller";
import { auth } from "../../middlewares/auth.middleware";

const paymentRoutes = express.Router();

paymentRoutes.post(
  "/checkout-session",
  auth("USER", "ADMIN"),
  PaymentController.createCheckoutSession
);

paymentRoutes.get(
  "/history",
  auth("USER", "ADMIN"),
  PaymentController.getPaymentHistory
);

export default paymentRoutes;