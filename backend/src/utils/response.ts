import { Response } from "express";

// Tipagem para respostas de sucesso
type SuccessResponse<T = unknown> = {
  success: true;
  data: T;
};

// Tipagem para respostas de erro
type ErrorResponse = {
  success: false;
  error: {
    code: string; // Identificador único do erro (ex: "invalid_birthdate")
    message: string; // Mensagem amigável
    details?: unknown; // Informações adicionais para debug
  };
};

export const sendSuccess = <T>(res: Response, data: T, status = 200): void => {
  // Impede envio duplo
  if (res.headersSent) {
    console.warn("Resposta já enviada, ignorando sendSuccess");
    return;
  }

  const response: SuccessResponse<T> = { success: true, data };
  res.status(status).json(response);
};

export const sendError = (
  res: Response,
  options: {
    code: string;
    message: string;
    status?: number;
    details?: unknown;
  }
): void => {
  // Impede envio duplo
  if (res.headersSent) {
    console.warn("Resposta já enviada, ignorando sendError");
    return;
  }

  const { code, message, status = 500, details } = options;
  const response: ErrorResponse = {
    success: false,
    error: { code, message, details },
  };

  res.status(status).json(response);
};