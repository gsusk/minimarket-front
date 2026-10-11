import { expect, test } from "@playwright/test";
import { finishEvidence } from "./support/evidence";

test.describe("Registro", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/register");
  });

  test("CP-08 - enviar formulario de registro vacio", async ({ page }, testInfo) => {
    await page.getByRole("button", { name: /registrarme/i }).click();

    await expect(page.getByText("First Name is required")).toBeVisible();
    await expect(page.getByText("Last Name is required")).toBeVisible();
    await expect(page.getByText("Email is required")).toBeVisible();
    await expect(page.getByText("Password is required")).toBeVisible();

    await finishEvidence(page, testInfo, "CP-08", "registro_formulario_vacio");
  });

  test("CP-09 - enviar datos invalidos en registro", async ({ page }, testInfo) => {
    await page.fill('input[name="email"]', "x@xx.x_!");
    await page.fill('input[name="password"]', "123");
    await page.fill('input[name="firstName"]', "a");
    await page.fill('input[name="lastName"]', "b");

    await page.getByRole("button", { name: /registrarme/i }).click();

    await expect(page.getByText("Needs to be a valid email")).toBeVisible();
    await expect(page.getByText("at least 6 characters")).toBeVisible();
    await expect(page.getByText("Need to be at least 2 characters")).toHaveCount(2);

    await finishEvidence(page, testInfo, "CP-09", "registro_datos_invalidos");
  });

  test("CP-10 - registrar usuario con datos validos", async ({ page }, testInfo) => {
    const uniqueEmail = `test_${Date.now()}@gmail.com`;

    await page.fill('input[name="email"]', uniqueEmail);
    await page.fill('input[name="password"]', "123456");
    await page.fill('input[name="firstName"]', "test");
    await page.fill('input[name="lastName"]', "person");

    await page.getByRole("button", { name: /registrarme/i }).click();
    await expect(page).toHaveURL("/");
    await expect(page.getByText(/ofertas/i)).toBeVisible();

    await finishEvidence(page, testInfo, "CP-10", "registro_usuario_valido");
  });
});
