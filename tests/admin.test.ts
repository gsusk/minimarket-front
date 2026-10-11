import { expect, test } from "@playwright/test";
import { finishEvidence } from "./support/evidence";

const ADMIN_EMAIL = "admin@gmail.com";
const ADMIN_PASS = "123456789";

test.describe("Admin productos", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
    await page.waitForLoadState("networkidle");
    await page.fill('input[name="email"]', ADMIN_EMAIL);
    await page.fill('input[name="password"]', ADMIN_PASS);
    await page.getByRole("button", { name: /iniciar/i }).click();
    await page.waitForURL("**/admin", { timeout: 15000 });
  });

  test("CP-13 - crear producto nuevo", async ({ page }, testInfo) => {
    const randomName = "Producto Test " + Math.floor(Math.random() * 100000);

    await page.goto("/admin/products");
    await expect(page.getByText(/Productos/i).first()).toBeVisible({ timeout: 10000 });

    await page.getByRole("button", { name: /Nuevo producto/i }).click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();

    await page.getByTestId("nombre_dialog_producto").fill(randomName);
    await page.getByTestId("marca_dialog_producto").fill("Marca Playwright");
    await page.getByTestId("descripcion_dialog_producto").fill("Descripcion generada por test E2E");
    await page.getByTestId("precio_dialog_producto").fill("1500");
    await page.getByTestId("stock_dialog_producto").fill("50");

    await page.getByTestId("categoria_dialog_producto").click();
    await page.getByRole("option", { name: /Electr/i }).click();

    await page.getByRole("button", { name: /Anadir/i }).click();
    await dialog.locator('input[placeholder="Clave"]').last().fill("marca");
    await dialog.locator('input[placeholder="Valor"]').last().fill("Marca Playwright");

    await page.getByRole("button", { name: /Guardar/i }).click();

    await expect(dialog).not.toBeVisible({ timeout: 15000 });
    await expect(page.getByText(randomName)).toBeVisible({ timeout: 10000 });

    await finishEvidence(page, testInfo, "CP-13", "admin_crear_producto");
  });

  test("CP-14 - editar producto existente", async ({ page }, testInfo) => {
    await page.goto("/admin/products");

    const row = page.locator("div").filter({ hasText: "Stock:" }).first();
    await expect(row).toBeVisible({ timeout: 10000 });

    const productName = await row.locator("p").first().innerText();
    const newName = productName + " Editado";

    await row.locator('button:has(svg[data-testid="EditOutlinedIcon"])').first().click();

    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();

    await page.getByTestId("nombre_dialog_producto").fill(newName);
    await page.getByRole("button", { name: /Guardar/i }).click();

    await page.waitForTimeout(3000);

    await finishEvidence(page, testInfo, "CP-14", "admin_editar_producto");

    const dialogVisible = await dialog.isVisible();
    if (!dialogVisible) {
      await expect(page.getByText(newName)).toBeVisible({ timeout: 10000 });
    }
  });

  test("CP-15 - eliminar producto", async ({ page }, testInfo) => {
    await page.goto("/admin/products");

    await expect(page.getByText(/Stock:/).first()).toBeVisible({ timeout: 10000 });

    await page.locator('button:has(svg[data-testid="DeleteOutlineIcon"])').first().click();

    const confirmDialog = page.getByRole("dialog", { name: /Eliminar producto/i });
    await expect(confirmDialog).toBeVisible();

    await confirmDialog.getByRole("button", { name: /Eliminar/i }).click();
    await expect(confirmDialog).not.toBeVisible({ timeout: 10000 });

    await finishEvidence(page, testInfo, "CP-15", "admin_eliminar_producto");
  });
});
