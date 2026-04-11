import {prisma} from "../../lib/prisma";
import { AppError } from "../../errors/AppError";

// =======================
// create comment / reply
// =======================
export const createComment = async (
  userId: string,
  payload: any
) => {
  const { content, reviewId, parentId } = payload;

  // review check
  const review = await prisma.review.findUnique({
    where: { id: reviewId },
  });

  if (!review) {
    throw new AppError(404, "Review not found");
  }

  // reply হলে parent check
  if (parentId) {
    const parent = await prisma.comment.findUnique({
      where: { id: parentId },
    });

    if (!parent) {
      throw new AppError(404, "Parent comment not found");
    }
  }

  const comment = await prisma.comment.create({
    data: {
      content,
      reviewId,
      parentId,
      userId,
    },
  });

  return comment;
};

// =======================
// get nested comments
// =======================
export const getCommentsByReview = async (
  reviewId: string
) => {
  const comments = await prisma.comment.findMany({
    where: {
      reviewId,
      parentId: null,
    },
    include: {
      user: true,
      replies: {
        include: {
          user: true,
          replies: {
            include: {
              user: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return comments;
};

// =======================
// delete own comment
// =======================
export const deleteComment = async (
  userId: string,
  commentId: string
) => {
  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
  });

  if (!comment) {
    throw new AppError(404, "Comment not found");
  }

  if (comment.userId !== userId) {
    throw new AppError(403, "Unauthorized");
  }

  await prisma.comment.delete({
    where: { id: commentId },
  });
};