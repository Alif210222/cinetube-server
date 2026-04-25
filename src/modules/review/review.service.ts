import {prisma} from "../../lib/prisma";
import { AppError } from "../../errors/AppError";

// ==========================
// ⭐ UPDATE MOVIE RATING
// ==========================
const updateMovieRating = async (movieId: string) => {
  const reviews = await prisma.review.findMany({
    where: {
      movieId,
      status: "APPROVED",
    },
  });

  const totalReviews = reviews.length;

  const avgRating =
    totalReviews === 0
      ? 0
      : reviews.reduce((sum :number, r:any) => sum + r.rating, 0) /
        totalReviews;

  await prisma.movie.update({
    where: { id: movieId },
    data: {
      avgRating,
      totalReviews,
    },
  });
};

// ==========================
// ✅ CREATE REVIEW
// ==========================
export const createReview = async (
  userId: string,
  payload: any
) => {
  const { movieId } = payload;

  // 🔍 prevent duplicate review
  const existing = await prisma.review.findUnique({
    where: {
      userId_movieId: {
        userId,
        movieId,
      },
    },
  });

  if (existing) {
    throw new AppError(400, "You already reviewed this movie");
  }

  const review = await prisma.review.create({
    data: {
      ...payload,
      userId,
    },
  });

  return review;
};

// ==========================
// ✅ GET REVIEWS
// ==========================
export const getReviews = async (query: any) => {
  const { movieId } = query;

  const where: any = {
    // status: "APPROVED",
  };

  if (movieId) {
    where.movieId = movieId;
  }

  const reviews = await prisma.review.findMany({
    where,
    include: {
      user: true,
      comments: true,
      likes: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return reviews;
};

// ==========================
// ✅ UPDATE REVIEW
// ==========================
export const updateReview = async (
  userId: string,
  reviewId: string,
  payload: any
) => {
  const review = await prisma.review.findUnique({
    where: { id: reviewId },
  });

  if (!review) {
    throw new AppError(404, "Review not found");
  }

  if (review.userId !== userId) {
    throw new AppError(403, "Unauthorized");
  }

  // if (review.status === "APPROVED") {
  //   throw new AppError(
  //     400,
  //     "Cannot edit approved review"
  //   );
  // }

  const updated = await prisma.review.update({
    where: { id: reviewId },
    data: payload,
  });

  return updated;
};

// ==========================
// ✅ DELETE REVIEW
// ==========================
export const deleteReview = async (
  userId: string,
  reviewId: string
) => {
  const review = await prisma.review.findUnique({
    where: { id: reviewId },
  });

  if (!review) {
    throw new AppError(404, "Review not found");
  }

  if (review.userId !== userId) {
    throw new AppError(403, "Unauthorized");
  }

  await prisma.review.delete({
    where: { id: reviewId },
  });
};

// ==========================
// ✅ APPROVE REVIEW (ADMIN)
// ==========================
export const approveReview = async (reviewId: string) => {
  const review = await prisma.review.findUnique({
    where: { id: reviewId },
  });

  if (!review) {
    throw new AppError(404, "Review not found");
  }

  const updated = await prisma.review.update({
    where: { id: reviewId },
    data: {
      status: "APPROVED",
    },
  });

  // ⭐ update movie rating
  await updateMovieRating(review.movieId);

  return updated;
};