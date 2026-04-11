import { Response } from "express";

import * as WatchlistService from "./watchList.service";

// ==========================
// add movie
// ==========================
export const addToWatchlist = async (
  req: any,
  res: Response
) => {
  const userId = req.user.userId;
  const movieId = req.params.movieId;

  const result =
    await WatchlistService.addToWatchlist(
      userId,
      movieId
    );

  res.status(201).json({
    success: true,
    message: "Added to watchlist",
    data: result,
  });
};

// ==========================
// get my watchlist
// ==========================
export const getMyWatchlist = async (
  req: any,
  res: Response
) => {
  const userId = req.user.userId;

  const result =
    await WatchlistService.getMyWatchlist(userId);

  res.status(200).json({
    success: true,
    data: result,
  });
};

// ==========================
// remove movie
// ==========================
export const removeFromWatchlist = async (
  req: any,
  res: Response
) => {
  const userId = req.user.userId;
  const movieId = req.params.movieId;

  await WatchlistService.removeFromWatchlist(
    userId,
    movieId
  );

  res.status(200).json({
    success: true,
    message: "Removed from watchlist",
  });
};

