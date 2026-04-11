import express from "express";
import * as WatchlistController from "./watchList.controller";
import { auth } from "../../middlewares/auth.middleware";

const router = express.Router();

// add to watchlist
router.post(
  "/:movieId",
  auth("USER"),
  WatchlistController.addToWatchlist
);

// get my watchlist
router.get(
  "/my-watchlist",
  auth("USER"),
  WatchlistController.getMyWatchlist
);

// remove from watchlist
router.delete(
  "/:movieId",
  auth("USER"),
  WatchlistController.removeFromWatchlist
);

export default router;