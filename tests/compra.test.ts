import { expect, test } from "@playwright/test"

const TEST_EMAIL = `compra_test_${Date.now()}@gmail.com`;
const TEST_PASS = "123456";



test.describe("Realizar compra", () => {

  test.beforeEach(async ({ page }) => {

    await page.goto("/register");
    await page.waitForLoadState("networkidle");
    await page.fill('input[name="email"]', TEST_EMAIL);
    await page.fill('input[name="password"]', TEST_PASS);
    await page.fill('input[name="firstName"]', "Test");
    await page.fill('input[name="lastName"]', "Compra");
    await page.getByRole("button", { name: /registrarme/i }).click();
    await page.waitForURL("http://localhost:3000/", { timeout: 15000 });

  })

  test("Debería completar todo el proceso de checkout", async ({ page }) => {

    await page.goto("/product/1/smart-tv-samsung-oled-65-4k-qn65s90c");
    await page.waitForLoadState("networkidle");
    await page.getByRole("button", { name: /agregar al carrito/i }).click();
    await expect(page.getByText(/en el carrito/i)).toBeVisible({ timeout: 5000 });

    await page.goto("/checkout");
    await page.waitForLoadState("networkidle");

    await expect(page.getByText(/Finalizar compra/i)).toBeVisible({ timeout: 10000 });

    const btnContinuar = page.getByRole("button", { name: /continuar al env/i });
    await btnContinuar.waitFor({ state: "visible", timeout: 5000 }).catch(() => { });
    if (await btnContinuar.isVisible()) await btnContinuar.click();

    await page.fill('input[name="shippingFullName"]', "Test Compra");
    await page.fill('input[name="shippingAddressLine"]', "Avenida Siempreviva 742");
    await page.fill('input[name="shippingCity"]', "Bogotá");
    await page.fill('input[name="shippingZipCode"]', "110111");
    await page.fill('input[name="shippingCountry"]', "Colombia");

    await page.getByRole("button", { name: /finalizar compra|pagar/i }).first().click();

    await page.waitForTimeout(2000);
  });

  test("Flujo alternativo: datos incompletos o pago rechazado", async ({ page }) => {

    await page.goto("/product/2/smart-tv-lg-c3-oled-55-4k-evo");
    await page.waitForLoadState("networkidle");
    await page.getByRole("button", { name: /agregar al carrito/i }).click();
    await expect(page.getByText(/en el carrito/i)).toBeVisible({ timeout: 5000 });

    await page.goto("/checkout");
    await page.waitForLoadState("networkidle");
    await expect(page.getByText(/Finalizar compra/i)).toBeVisible({ timeout: 10000 });

    const btnContinuar = page.getByRole("button", { name: /continuar al env/i });
    await btnContinuar.waitFor({ state: "visible", timeout: 5000 }).catch(() => { });
    if (await btnContinuar.isVisible()) await btnContinuar.click();

    await page.getByRole("button", { name: /finalizar compra|pagar/i }).first().click({ force: true });

    await expect(page.getByText(/Por favor completa/i)).toBeVisible({ timeout: 5000 });
  });
});
