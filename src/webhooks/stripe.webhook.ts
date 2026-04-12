import { Request, Response } from "express";
import {prisma} from "../lib/prisma";
import { stripe } from "../config/stripe";

export const stripeWebhook = async (
  req: Request,
  res: Response
) => {
  const signature =
    req.headers["stripe-signature"];

  const event =
    stripe.webhooks.constructEvent(
      req.body,
      signature as string,
      process.env
        .STRIPE_WEBHOOK_SECRET as string
    );

  // ==========================
  // PAYMENT SUCCESS
  // ==========================
  if (
    event.type ===
    "checkout.session.completed"
  ) {
    const session: any =
      event.data.object;

    const userId =
      session.metadata.userId;

    const plan =
      session.metadata.plan;

    // payment create
    await prisma.payment.create({
      data: {
        userId,
        amount:
          session.amount_total / 100,

        currency:
          session.currency,

        status: "SUCCEEDED",

        type: "SUBSCRIPTION",

        stripePaymentId:
          session.payment_intent,
      },
    });

    // user premium
    await prisma.user.update({
      where: { id: userId },

      data: {
        membershipStatus:
          "PREMIUM",
      },
    });

    // subscription create/update
    await prisma.subscription.upsert({
      where: { userId },

      update: {
        stripeSubId:
          session.subscription,

        status: "ACTIVE",

        plan,
      },

      create: {
        userId,

        stripeSubId:
          session.subscription,

        stripeCustomerId:
          session.customer,

        status: "ACTIVE",

        plan,
      },
    });
  }

  // ==========================
  // CANCELLED
  // ==========================
  if (
    event.type ===
    "customer.subscription.deleted"
  ) {
    const sub: any =
      event.data.object;

    await prisma.subscription.updateMany({
      where: {
        stripeSubId: sub.id,
      },

      data: {
        status: "CANCELLED",
      },
    });
  }

  res.json({
    received: true,
  });
};