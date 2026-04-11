import express from "express";
import * as ReviewController from "./review.controller";
import { auth } from "../../middlewares/auth.middleware";

const reviewRoutes = express.Router();

//  User
reviewRoutes.post("/", auth("USER"), ReviewController.createReview);
reviewRoutes.patch("/:id", auth("USER", "ADMIN"), ReviewController.updateReview);
reviewRoutes.delete("/:id", auth("USER", "ADMIN"), ReviewController.deleteReview);

//  Public
reviewRoutes.get("/", ReviewController.getReviews);

//  Admin
reviewRoutes.patch(
  "/approve/:id",
   auth("ADMIN"),
  ReviewController.approveReview
);

export default reviewRoutes;



