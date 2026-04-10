import { Request, Response } from "express";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { loginUser, registerUser } from "./auth.service";


// ==========================
//  ENV
// ==========================
const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET as string;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET as string;



// ==========================
//  TOKEN FUNCTIONS
// ==========================
const createAccessToken = (payload: object) => {
  return jwt.sign(payload, ACCESS_SECRET, {
    expiresIn: "15m",
  });
};

const createRefreshToken = (payload: object) => {
  return jwt.sign(payload, REFRESH_SECRET, {
    expiresIn: "7d",
  });
};

// ==========================
// 📝 REGISTER
// ==========================
export const register = async (req: Request, res: Response) => {
  const result = await registerUser(req.body);

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: result,
  });
};

// ==========================
// 🔐 LOGIN
// ==========================
export const login = async (req: Request, res: Response) => {
  const result = await loginUser(req.body);

  // 🍪 Set Refresh Token
  res.cookie("refreshToken", result.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  res.status(200).json({
    success: true,
    message: "Login successful",
    userName: result.userName,
    userEmail: result.userEmail,
    userRole: result.userRole,
    accessToken: result.accessToken,
    refreshToken: result.refreshToken,
    
  });
};

// ==========================
// 🔄 REFRESH TOKEN
// ==========================
export const refreshToken = async (req: Request, res: Response) => {
  try {
    const token = req.cookies?.refreshToken;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No refresh token provided",
      });
    }

    // 🔍 Verify refresh token
    const decoded: any = jwt.verify(token, REFRESH_SECRET);

    // 🆕 Create new access token
    const newAccessToken = createAccessToken({
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
    });

    res.status(200).json({
      success: true,
      accessToken: newAccessToken,
    });
  } catch (error: any) {
    res.status(403).json({
      success: false,
      message: "Invalid refresh token",
    });
  }
};

// ==========================
// 🚪 LOGOUT USER
// ==========================
export const logout = async (req: Request, res: Response) => {
  res.clearCookie("refreshToken");

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};