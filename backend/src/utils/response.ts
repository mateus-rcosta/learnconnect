import { Response } from "express";

export const sendSuccess = (res: Response, data: any, status: number = 200): Response => {
  return res.status(status).json({ success: true, data });
};

export const sendError = (res: Response, message: string, status: number = 500): Response => {
  return res.status(status).json({ success: false, error: message });
};