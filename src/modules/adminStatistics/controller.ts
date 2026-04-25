import { Response } from "express";
import * as service from "./service";

export const getStatistics = async (
  req: any,
  res: Response
) => {
  const result =
    await service.getStatistics();

  res.json({
    success: true,
    data: result,
  });
};