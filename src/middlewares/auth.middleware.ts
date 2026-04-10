// middlewares/auth.middleware.ts

import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { AppError } from "../errors/AppError";

// 🔐 Extend Request (optional but recommended)
export interface AuthRequest extends Request {
  user?: JwtPayload;
}

// 🔑 Verify Token Middleware
export const auth =
  (...roles: string[]) =>
  (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;

      if (!token) {
        throw new AppError(401, "You are not authorized!");
      }

      // Bearer token format
      const splitToken = token.split(" ");
      const accessToken = splitToken[1];

      if (!accessToken) {
        throw new AppError(401, "Invalid token format");
      }

      // 🔍 Verify Access Token
      const decoded = jwt.verify(
        accessToken,
        process.env.JWT_ACCESS_SECRET as string
      ) as JwtPayload;

      req.user = decoded;

      // 🔒 Role based access
      if (roles.length && !roles.includes(decoded.role)) {
        throw new AppError(403, "Forbidden access");
      }

      next();
    } catch (error) {
      next(error);
    }
  };