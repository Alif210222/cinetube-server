import { Request, Response } from "express";
import * as UserService from "./user.service";

export const getAllUsers = async (
  req: Request,
  res: Response
) => {
  const result =
    await UserService.getAllUsers(req.query);

  res.status(200).json({
    success: true,
    message: "Users fetched successfully",
    meta: result.meta,
    data: result.data,
  });
};