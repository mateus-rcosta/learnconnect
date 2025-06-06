import { Request, Response, NextFunction } from "express";
import { sendError } from "../utils/response";
import { validationResult } from "express-validator/lib/validation-result";

export const validateRequest = (req: Request, res: Response, next: NextFunction): void => {
    console.debug("[validateRequest] Validando dados da requisição");
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.debug("[validateRequest] Erros de validação:", errors.array());
      sendError(res, {
        code: "validation_error",
        message: "Dados inválidos na requisição",
        status: 400,
        details: errors.array()
      });
      return;
    }
    next();
  };