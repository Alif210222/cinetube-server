import jwt from "jsonwebtoken";

export const createAccessToken = (payload: object) => {
  return jwt.sign(payload, process.env.JWT_ACCESS_SECRET as string, {
    expiresIn: "1d",
  });
};

export const createRefreshToken = (payload: object) => {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET as string, {
    expiresIn: "7d",
  });
};

export const verifyToken = (token: string, secret: string) => {
  return jwt.verify(token, secret);
};