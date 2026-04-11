import { Request, Response } from "express";
import * as MovieService from "./movie.service";

// ✅ Create Movie
export const createMovie = async (req: Request, res: Response) => {
  const result = await MovieService.createMovie(req.body);

  res.status(201).json({
    success: true,
    message: "Movie created successfully",
    data: result,
  });
};

// ✅ Get All Movies (search, filter, sort)
export const getAllMovies = async (req: Request, res: Response) => {
  const result = await MovieService.getAllMovies(req.query);

  res.status(200).json({
    success: true,
    data: result,
  });
};

// ✅ Get Single Movie
export const getSingleMovie = async (req: Request, res: Response) => {
  const result = await MovieService.getSingleMovie(req.params.slug as string);

  res.status(200).json({
    success: true,
    data: result,
  });
};

// ✅ Update Movie
export const updateMovie = async (req: Request, res: Response) => {
  const result = await MovieService.updateMovie(
    req.params.id as string,
    req.body
  );

  res.status(200).json({
    success: true,
    message: "Movie updated successfully",
    data: result,
  });
};

// ✅ Delete Movie
export const deleteMovie = async (req: Request, res: Response) => {
  await MovieService.deleteMovie(req.params.id as string);

  res.status(200).json({
    success: true,
    message: "Movie deleted successfully",
  });
};