
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
  console.log(error);
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

      if (status === 409) {
        return new AppError(data?.message || "Conflicto con un recurso existente", data?.errorCode || "CONFLICT_ERROR");
      }

      if (status === 400 && data?.validationErrors) {
        const issues: ValidationIssue[] = Array.isArray(data.validationErrors)
          ? data.validationErrors.map((ve: any) => ({
              field: ve.field ?? ve.attributeName ?? "",
              message: ve.message ?? ve.errorMessage ?? "",
            }))
          : [];
        const details = issues
          .map((i) => (i.field ? `${i.field}: ${i.message}` : i.message))
          .filter(Boolean)
          .join(", ");
        const message = data?.message && data.message !== "Validation Failed"
          ? data.message
          : (details ? `Error de validación: ${details}` : "Hubo un problema con los datos enviados");
        return new ValidationError(issues, message);
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
