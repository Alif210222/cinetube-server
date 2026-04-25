import { Request, Response } from "express";
import Stripe from "stripe";
import { prisma } from "../lib/prisma";
import { stripe } from "../config/stripe";

export const stripeWebhook = async (
  req: Request,
  res: Response
) => {
  try {
    const signature = req.headers["stripe-signature"];

    if (!signature) {
      return res.status(400).json({
        success: false,
        message: "Stripe signature missing",
      });
    }

    const event = stripe.webhooks.constructEvent(
      req.body,
      signature as string,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );

    // ======================================
    // CHECKOUT SUCCESS
    // ======================================
    if (
      event.type ===
      "checkout.session.completed"
    ) {
      const session = event.data.object as any;

      const metadata = session.metadata || {};
      const type = metadata.type;

      // ======================================
      // MOVIE PURCHASE
      // ======================================
      if (type === "PURCHASE") {
        const userId = metadata.userId;
        const movieId = metadata.movieId;

        // duplicate protection
        const existing =
          await prisma.payment.findFirst({
            where: {
              userId,
              movieId,
              type: "PURCHASE",
              status: "SUCCEEDED",
            },
          });

        if (!existing) {
          await prisma.payment.create({
            data: {
              userId,
              movieId,
              amount:
                (session.amount_total || 0) /
                100,

              currency:
                session.currency ||
                "usd",

              status:
                "SUCCEEDED",

              type:
                "PURCHASE",

              stripePaymentId:
                session.payment_intent as string,
            },
          });
        }
      }

      // ======================================
      // SUBSCRIPTION
      // ======================================
      if (
        type === "SUBSCRIPTION"
      ) {
        const userId = metadata.userId;
        const plan = metadata.plan;

        await prisma.payment.create({
          data: {
            userId,
            amount:
              (session.amount_total || 0) /
              100,

            currency:
              session.currency ||
              "usd",

            status:
              "SUCCEEDED",

            type:
              "SUBSCRIPTION",

            stripePaymentId:
              session.payment_intent as string,
          },
        });

        await prisma.user.update({
          where: {
            id: userId,
          },
          data: {
            membershipStatus:
              "PREMIUM",
          },
        });

        await prisma.subscription.upsert({
          where: {
            userId,
          },

          update: {
            stripeSubId:
              session.subscription as string,

            stripeCustomerId:
              session.customer as string,

            plan,

            status:
              "ACTIVE",
          },

          create: {
            userId,

            stripeSubId:
              session.subscription as string,

            stripeCustomerId:
              session.customer as string,

            plan,

            status:
              "ACTIVE",
          },
        });
      }
    }

    // ======================================
    // SUBSCRIPTION CANCELLED
    // ======================================
    if (
      event.type ===
      "customer.subscription.deleted"
    ) {
      const sub = event.data.object as any;

      const subscription =
        await prisma.subscription.updateMany({
          where: {
            stripeSubId: sub.id,
          },
          data: {
            status:
              "CANCELLED",
          },
        });

      // optional downgrade user
      if (subscription.count > 0) {
        const found =
          await prisma.subscription.findFirst({
            where: {
              stripeSubId: sub.id,
            },
          });

        if (found) {
          await prisma.user.update({
            where: {
              id: found.userId,
            },
            data: {
              membershipStatus:
                "FREE",
            },
          });
        }
      }
    }

    return res.status(200).json({
      received: true,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message:
        "Webhook Error",
      error: error.message,
    });
  }
};