import {prisma} from "../../lib/prisma";
import { stripe } from "../../config/stripe";

export const createCheckoutSession = async (
  userId: string,
  plan: string
) => {
  const prices: any = {
    MONTHLY: 999,
    YEARLY: 7999,
  };

  const intervals: any = {
    MONTHLY: "month",
    YEARLY: "year",
  };

  const session =
    await stripe.checkout.sessions.create({
      mode: "subscription",

      payment_method_types: ["card"],

      line_items: [
        {
          price_data: {
            currency: "usd",

            product_data: {
              name: `${plan} Plan`,
            },

            recurring: {
              interval: intervals[plan],
            },

            unit_amount: prices[plan],
          },

          quantity: 1,
        },
      ],

      success_url:
        `${process.env.CLIENT_URL}/payment-success`,

      cancel_url:
        `${process.env.CLIENT_URL}/pricing`,

      metadata: {
        userId,
        plan,
      },
    });

  return {
    url: session.url,
  };
};

export const getPaymentHistory = async (
  userId: string
) => {
  return await prisma.payment.findMany({
    where: { userId },

    orderBy: {
      createdAt: "desc",
    },
  });
};