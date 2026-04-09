// errors/handlePrismaError.ts
import { Prisma } from "@prisma/client";

export const handlePrismaError = (error: any) => {
  let statusCode = 500;
  let message = "Something went wrong";

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    // Unique constraint error
    if (error.code === "P2002") {
      statusCode = 400;
      message = `Duplicate field value: ${error.meta?.target}`;
    }

    // Record not found
    if (error.code === "P2025") {
      statusCode = 404;
      message = "Record not found";
    }
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    statusCode = 400;
    message = "Validation error from Prisma";
  }

  return {
    statusCode,
    message,
  };
};