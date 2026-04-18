import {prisma} from "../../lib/prisma";
import { stripe } from "../../config/stripe";

export const getMySubscription =
async (userId: string) => {
  return await prisma.subscription.findUnique({
    where: { userId },
  });
};

export const cancelSubscription =
async (userId: string) => {
  const sub =
    await prisma.subscription.findUnique({
      where: { userId },
    });

  if (!sub?.stripeSubId) return;

  await stripe.subscriptions.cancel(
    sub.stripeSubId
  );
};