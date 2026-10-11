import { expect, test } from "@playwright/test";
import { AxiosError } from "axios";

import {
  AppError,
  AuthError,
  NetworkError,
  ValidationError,
  normalizeError,
  type ValidationIssue,
} from "../../src/app/utils/errors";

test.describe("utils/errors", () => {
  let originalConsoleLog: typeof console.log;

  test.beforeEach(() => {
    originalConsoleLog = console.log;
    console.log = () => { };
  });

  test.afterEach(() => {
    console.log = originalConsoleLog;
  });

  test("AppError conserva mensaje, codigo y bandera operacional", () => {
    const error = new AppError("Fallo controlado", "TEST_ERROR", false);

    expect(error).toBeInstanceOf(Error);
    expect(error.name).toBe("AppError");
    expect(error.message).toBe("Fallo controlado");
    expect(error.code).toBe("TEST_ERROR");
    expect(error.isOperational).toBe(false);
  });

  test("ValidationError conserva los errores de validacion", () => {
    const issues: ValidationIssue[] = [
      { field: "email", message: "Email is required" },
      { field: "password", message: "Password is required" },
    ];

    const error = new ValidationError(issues);

    expect(error).toBeInstanceOf(AppError);
    expect(error.code).toBe("VALIDATION_ERROR");
    expect(error.issues).toEqual(issues);
  });

  test("normalizeError devuelve la misma instancia si ya es AppError", () => {
    const original = new NetworkError();

    expect(normalizeError(original)).toBe(original);
  });

  test("normalizeError convierte errores 401 y 403 en AuthError", () => {
    const error = axiosResponseError(401, { message: "Token expirado" });

    const normalized = normalizeError(error);

    expect(normalized).toBeInstanceOf(AuthError);
    expect(normalized.message).toBe("Token expirado");
    expect(normalized.code).toBe("AUTH_ERROR");
  });

  test("normalizeError convierte errores 400 con validationErrors en ValidationError", () => {
    const validationErrors: ValidationIssue[] = [
      { field: "firstName", message: "Need to be at least 2 characters" },
    ];
    const error = axiosResponseError(400, { validationErrors });

    const normalized = normalizeError(error);

    expect(normalized).toBeInstanceOf(ValidationError);
    expect((normalized as ValidationError).issues).toEqual(validationErrors);
  });

  test("normalizeError convierte respuestas del servidor en AppError", () => {
    const error = axiosResponseError(500, {
      message: "No se pudo guardar el producto",
      errorCode: "PRODUCT_SAVE_FAILED",
    });

    const normalized = normalizeError(error);

    expect(normalized).toBeInstanceOf(AppError);
    expect(normalized.message).toBe("No se pudo guardar el producto");
    expect(normalized.code).toBe("PRODUCT_SAVE_FAILED");
  });

  test("normalizeError convierte errores de red en NetworkError", () => {
    const error = new AxiosError("Network Error", "ERR_NETWORK");
    error.request = {};

    const normalized = normalizeError(error);

    expect(normalized).toBeInstanceOf(NetworkError);
    expect(normalized.code).toBe("NETWORK_ERROR");
  });

  test("normalizeError convierte errores nativos y valores desconocidos", () => {
    expect(normalizeError(new Error("Fallo inesperado")).message).toBe("Fallo inesperado");
    expect(normalizeError("fallo").message).toBe("Ocurrio un error desconocido");
  });
});

function axiosResponseError(status: number, data: unknown): AxiosError {
  return new AxiosError(
    "Request failed",
    undefined,
    undefined,
    {},
    {
      status,
      data,
      statusText: "Error",
      headers: {},
      config: { headers: undefined as never },
    },
  );
}
