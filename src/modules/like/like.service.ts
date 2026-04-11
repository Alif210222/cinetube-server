import {prisma} from "../../lib/prisma";

// =======================
// toggle like/unlike
// =======================
export const toggleLike = async (
  userId: string,
  reviewId: string
) => {
  const existing = await prisma.like.findUnique({
    where: {
      userId_reviewId: {
        userId,
        reviewId,
      },
    },
  });

  // unlike
  if (existing) {
    await prisma.like.delete({
      where: {
        userId_reviewId: {
          userId,
          reviewId,
        },
      },
    });

    return {
      message: "Unliked successfully",
    };
  }

  // like
  await prisma.like.create({
    data: {
      userId,
      reviewId,
    },
  });

  return {
    message: "Liked successfully",
  };
};

// =======================
// count likes
// =======================
export const getLikesCount = async (
  reviewId: string
) => {
  const total = await prisma.like.count({
    where: { reviewId },
  });

  return total;
};