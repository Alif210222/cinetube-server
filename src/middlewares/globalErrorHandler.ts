// middlewares/globalErrorHandler.ts
import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError";
import { handlePrismaError } from "../errors/handlePrismaError";

// Error flow = controller - service- catchAsync-globalErrorHandler

const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = 500;
  let message = "Internal Server Error";

  //  Custom AppError
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  }

  //  Prisma Error
  else if (err.code?.startsWith("P")) {
    const prismaError = handlePrismaError(err);
    statusCode = prismaError.statusCode;
    message = prismaError.message;
  }

  //  Generic Error
  else if (err instanceof Error) {
    message = err.message;
  }

  res.status(statusCode).json({
    success: false,
    message,
    error: process.env.NODE_ENV === "development" ? err : undefined,
  });
};

export default globalErrorHandler;