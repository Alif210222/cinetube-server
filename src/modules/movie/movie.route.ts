import express from "express";
import * as MovieController from "./movie.controller";
import { auth } from "../../middlewares/auth.middleware";

const movieRoutes = express.Router();

//  Public
movieRoutes.get("/", MovieController.getAllMovies);
movieRoutes.get("/:slug", MovieController.getSingleMovie);

//  Admin only
movieRoutes.post("/",  MovieController.createMovie);
movieRoutes.patch("/:id", auth("ADMIN"), MovieController.updateMovie);
movieRoutes.delete("/:id", auth("ADMIN"), MovieController.deleteMovie);

export default movieRoutes;