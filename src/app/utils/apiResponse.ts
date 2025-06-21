import { Response } from "express";

export function successResponseApi(res: Response, message: string, data: any) {
  res.json({
    success: true,
    message: message,
    data: data,
  });
}

export function errorResponseApi(res: Response, message: string, error: any) {
  res.json({
    message: message,
    success: false,
    error: error,
  });
}
