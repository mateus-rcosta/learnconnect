import { Request, Response, NextFunction } from "express";
import { sendError } from "../utils/response";
import { validationResult } from "express-validator/lib/validation-result";

export const validateRequest = (req: Request, res: Response, next: NextFunction): void => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        sendError(res, "Erro de validação.", 400);
    }
    next();
};