import {prisma} from "../../lib/prisma";
import { AppError } from "../../errors/AppError";

// ============================
// add to watchlist
// ============================
export const addToWatchlist = async (
  userId: string,
  movieId: string
) => {
  // movie exists check
  const movie = await prisma.movie.findUnique({
    where: { id: movieId },
  });

  if (!movie) {
    throw new AppError(404, "Movie not found");
  }

  // duplicate check
  const existing =
    await prisma.watchlist.findUnique({
      where: {
        userId_movieId: {
          userId,
          movieId,
        },
      },
    });

  if (existing) {
    throw new AppError(
      400,
      "Movie already in watchlist"
    );
  }

  const result = await prisma.watchlist.create({
    data: {
      userId,
      movieId,
    },
    include: {
      movie: true,
    },
  });

  return result;
};

// ============================
// get my watchlist
// ============================
export const getMyWatchlist = async (
  userId: string
) => {
  const result =
    await prisma.watchlist.findMany({
      where: { userId },
      include: {
        movie: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

  return result;
};

// ============================
// remove from watchlist
// ============================
export const removeFromWatchlist = async (
  userId: string,
  movieId: string
) => {
  const item =
    await prisma.watchlist.findUnique({
      where: {
        userId_movieId: {
          userId,
          movieId,
        },
      },
    });

  if (!item) {
    throw new AppError(
      404,
      "Movie not found in watchlist"
    );
  }

  await prisma.watchlist.delete({
    where: {
      userId_movieId: {
        userId,
        movieId,
      },
    },
  });

  return null;
};