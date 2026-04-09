// utils/sendResponse.ts
export const sendResponse = <T>(res: any, data: {
  statusCode: number;
  success: boolean;
  message?: string;
  data?: T;
}) => {
  res.status(data.statusCode).json(data);
};