import { expect, test } from "@playwright/test";
import { finishEvidence } from "./support/evidence";

const TEST_PASS = "123456";

test.describe("Compra", () => {
  test.beforeEach(async ({ page }) => {
    const testEmail = `compra_test_${Date.now()}_${Math.floor(Math.random() * 100000)}@gmail.com`;

    await page.goto("/register");
    await page.waitForLoadState("networkidle");
    await page.fill('input[name="email"]', testEmail);
    await page.fill('input[name="password"]', TEST_PASS);
    await page.fill('input[name="firstName"]', "Test");
    await page.fill('input[name="lastName"]', "Compra");
    await page.getByRole("button", { name: /registrarme/i }).click();
    await page.waitForURL("http://localhost:3000/", { timeout: 15000 });
  });

  test("CP-11 - completar flujo de checkout", async ({ page }, testInfo) => {
    await page.goto("/product/3/smart-tv-sony-bravia-xr-75-x90l-full-array-led");
    await page.waitForLoadState("networkidle");
    await page.getByRole("button", { name: /agregar al carrito/i }).click();
    await expect(page.getByText(/en el carrito/i)).toBeVisible({ timeout: 8000 });

    await page.goto("/checkout");
    await page.waitForLoadState("networkidle");

    await expect(page.getByText(/Finalizar compra/i)).toBeVisible({ timeout: 10000 });

    const btnContinuar = page.getByRole("button", { name: /continuar con el env/i });
    await btnContinuar.waitFor({ state: "visible", timeout: 8000 }).catch(() => { });
    if (await btnContinuar.isVisible()) await btnContinuar.click();

    await page.waitForSelector('input[name="shippingFullName"]', { timeout: 10000 });
    await page.fill('input[name="shippingFullName"]', "Test Compra");
    await page.fill('input[name="shippingAddressLine"]', "Avenida Siempreviva 742");
    await page.fill('input[name="shippingCity"]', "Bogota");
    await page.fill('input[name="shippingZipCode"]', "110111");
    await page.fill('input[name="shippingCountry"]', "Colombia");

    await finishEvidence(page, testInfo, "CP-11", "checkout_completo");

    await page.getByRole("button", { name: /confirmar orden|finalizar compra|pagar/i }).first().click();
    await page.waitForTimeout(3000);
  });

  test("CP-12 - validar datos incompletos o pago rechazado", async ({ page }, testInfo) => {
    await page.goto("/product/3/smart-tv-sony-bravia-xr-75-x90l-full-array-led");
    await page.waitForLoadState("networkidle");
    await page.getByRole("button", { name: /agregar al carrito/i }).click();
    await expect(page.getByText(/en el carrito/i)).toBeVisible({ timeout: 8000 });

    await page.goto("/checkout");
    await page.waitForLoadState("networkidle");
    await expect(page.getByText(/Finalizar compra/i)).toBeVisible({ timeout: 10000 });

    const btnContinuar = page.getByRole("button", { name: /continuar con el env/i });
    await btnContinuar.waitFor({ state: "visible", timeout: 8000 }).catch(() => { });
    if (await btnContinuar.isVisible()) await btnContinuar.click();

    await page.waitForSelector('input[name="shippingFullName"]', { timeout: 10000 });

    await page.getByRole("button", { name: /confirmar orden|finalizar compra|pagar/i }).first().click({ force: true });

    await expect(page.getByText(/Por favor completa/i)).toBeVisible({ timeout: 5000 });

    await finishEvidence(page, testInfo, "CP-12", "checkout_validacion_datos");
  });
});
