
import { hashPassword, comparePassword } from "../../utils/hash";
import {
  createAccessToken,
  createRefreshToken,
} from "../../utils/jwt";
import { AppError } from "../../errors/AppError";
import { prisma } from "../../lib/prisma";

export const registerUser = async (payload: any) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  if (existingUser) {
    throw new AppError(400, "User already exists");
  }

  const hashedPassword = await hashPassword(payload.password);

  const user = await prisma.user.create({
    data: {
      ...payload,
      password: hashedPassword,
    },
  });

  return user;
};

export const loginUser = async (payload: any) => {
  const user = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  if (!user) {
    throw new AppError(404, "User not found");
  }

  const isMatch = await comparePassword(
    payload.password,
    user.password
  );

  if (!isMatch) {
    throw new AppError(401, "Invalid credentials");
  }

  const jwtPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };

  const accessToken = createAccessToken(jwtPayload);
  const refreshToken = createRefreshToken(jwtPayload);
  const userName=user.name;
  const userEmail=user.email;
  const userRole=user.role;


  return {
    userName,
    userEmail,
    userRole,
    accessToken,
    refreshToken
  };
};