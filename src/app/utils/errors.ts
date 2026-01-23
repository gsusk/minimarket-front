
import { AxiosError } from "axios";

export type ValidationIssue = {
  field: string;
  message: string;
}

export class AppError extends Error {
  public readonly code: string;
  public readonly isOperational: boolean;

  constructor(message: string, code: string = "UNKNOWN_ERROR", isOperational: boolean = true) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class NetworkError extends AppError {
  constructor(message: string = "No se pudo conectar con el servidor. Verifique su conexion a internet") {
    super(message, "NETWORK_ERROR");
  }
}

export class ValidationError extends AppError {
  public readonly issues: ValidationIssue[];

  constructor(issues: ValidationIssue[], message: string = "Hubo un problema con los datos enviados") {
    super(message, "VALIDATION_ERROR");
    this.issues = issues;
  }
}

export class AuthError extends AppError {
  constructor(message: string = "Credenciales invalidas o sesión expirada") {
    super(message, "AUTH_ERROR");
  }
}

export const normalizeError = (error: unknown): AppError => {
  if (error instanceof AppError) {
    return error;
  }

  if (error instanceof AxiosError) {
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data as any;

      if (status === 401 || status === 403) {
        return new AuthError(data?.message || "No autorizado");
      }

      if (status === 400 && data?.validationErrors) {
        return new ValidationError(data.validationErrors);
      }

      return new AppError(data?.message || "Ocurrio un error en el servidor", data?.errorCode || "SERVER_ERROR");
    } else if (error.request) {
      return new NetworkError();
    }
  }

  if (error instanceof Error) {
    return new AppError(error.message);
  }

  return new AppError("Ocurrio un error desconocido");
};
