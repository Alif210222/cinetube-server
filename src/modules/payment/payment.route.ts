import express from "express";
import * as PaymentController from "./payment.controller";
import { auth } from "../../middlewares/auth.middleware";

const router = express.Router();

router.post(
  "/checkout-session",
  auth("USER", "ADMIN"),
  PaymentController.createCheckoutSession
);

router.get(
  "/history",
  auth("USER", "ADMIN"),
  PaymentController.getPaymentHistory
);

export default router;