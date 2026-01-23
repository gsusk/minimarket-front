import { AxiosError } from "axios";

export interface ValidationError {
  field: string;
  message: string;
}

export interface ApiErrorResponse {
  status: number;
  error: string;
  message: string;
  errorCode: string;
  timestamp: string;
  path?: string;
  validationErrors?: ValidationError[];
}

export function handleApiError(err: any): ApiErrorResponse & { isValidation: boolean; isAuthError: boolean } {
  let result: ApiErrorResponse = {
    status: 500,
    error: "Internal Server Error",
    message: "Ocurrio un error inesperado",
    errorCode: "UNKNOWN",
    timestamp: new Date().toISOString(),
  };

  if (err instanceof AxiosError) {
    if (err.response) {
      result = err.response.data as ApiErrorResponse;
    } else if (err.request) {
      result.message = "No se pudo conectar con el servidor";
      result.errorCode = "NETWORK_ERROR";
    }
  }

  return {
    ...result,
    isValidation: result.status === 400 || !!result.validationErrors?.length,
    isAuthError: result.status === 401 || result.status === 403
  };
}