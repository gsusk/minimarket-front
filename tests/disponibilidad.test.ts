import { expect, test } from "@playwright/test"

test.describe("Checkear Disponibilidad", () => {

  test("Flujo Normal: Producto en stock muestra botón habilitado para agregar al carrito", async ({ page }) => {
    await page.goto("/product/19/project-hail-mary-andy-weir-edicion-en-ingles");
    await expect(page.getByText("En stock")).toBeVisible();
    const btnAgregar = page.getByRole("button", { name: /agregar al carrito/i });
    await expect(btnAgregar).toBeVisible();
    await expect(btnAgregar).toBeEnabled();

    await page.screenshot({ path: "evidence/4_disponibilidad_en_stock.png" });
  });

  test("Flujo Alternativo (Ruta B): Producto sin stock muestra botón deshabilitado y chip Agotado", async ({ page }) => {
    await page.goto("/product/42/libro-agotado-ejemplo-de-prueba");
    await expect(page.locator('.MuiChip-label').getByText("Agotado")).toBeVisible();
    const btnAgregar = page.getByRole("button", { name: /agregar al carrito/i });
    await expect(btnAgregar).toBeDisabled();
  });

});
