// middlewares/notFound.ts
import { Request, Response, NextFunction } from "express";

const notFound = (req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    success: false,
    message: `API Not Found: ${req.originalUrl}`,
  });
};

export default notFound;