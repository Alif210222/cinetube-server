import { prisma } from "../../lib/prisma";

export const getStatistics =
  async () => {
    const totalUsers =
      await prisma.user.count();

    const totalMovies =
      await prisma.movie.count();

    const totalReviews =
      await prisma.review.count();

    const totalPurchases =
      await prisma.payment.count({
        where: {
          status: "SUCCEEDED",
          type: "PURCHASE",
        },
      });

    const payments =
      await prisma.payment.findMany({
        where: {
          status: "SUCCEEDED",
          type: "PURCHASE",
        },
      });

    const totalRevenue =
      payments.reduce(
        (sum: number, item:any) =>
          sum + Number(item.amount),
        0
      );

    return {
      totalUsers,
      totalMovies,
      totalReviews,
      totalPurchases,
      totalRevenue,
    };
  };