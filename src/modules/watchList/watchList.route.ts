import express from "express";
import * as WatchlistController from "./watchList.controller";
import { auth } from "../../middlewares/auth.middleware";

const watchListRoutes = express.Router();

// add to watchlist
watchListRoutes.post(
  "/:movieId",
  auth("USER"),
  WatchlistController.addToWatchlist
);

// get my watchlist
watchListRoutes.get(
  "/my-watchlist",
  auth("USER"),
  WatchlistController.getMyWatchlist
);



// remove from watchlist
watchListRoutes.delete(
  "/:movieId",
  auth("USER"),
  WatchlistController.removeFromWatchlist
);

export default watchListRoutes;