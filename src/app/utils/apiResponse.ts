import { Response } from "express";

export function successResponseApi(
  res: Response,
  statusCode: number,
  message: string,
  data: any
) {
  res.status(statusCode).json({
    success: true,
    message: message,
    data: data,
  });
}

export function errorResponseApi(
  res: Response,
  statusCode: number,
  message: string,
  error: any
) {
  res.status(statusCode).json({
    message: message,
    success: false,
    errorMessage: error.message,
    error: error,
  });
}
