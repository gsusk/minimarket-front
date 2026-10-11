import { expect, test } from "@playwright/test";
import { finishEvidence } from "./support/evidence";

test.describe("Disponibilidad", () => {
  test("CP-16 - producto con stock habilita boton de compra", async ({ page }, testInfo) => {
    await page.goto("/product/19/project-hail-mary-andy-weir-edicion-en-ingles");
    await expect(page.getByText("En stock")).toBeVisible();
    const btnAgregar = page.getByRole("button", { name: /agregar al carrito/i });
    await expect(btnAgregar).toBeVisible();
    await expect(btnAgregar).toBeEnabled();

    await finishEvidence(page, testInfo, "CP-16", "disponibilidad_en_stock");
  });

  test("CP-17 - producto sin stock deshabilita boton de compra", async ({ page }, testInfo) => {
    await page.goto("/product/42/libro-agotado-ejemplo-de-prueba");
    await expect(page.locator(".MuiChip-label").getByText("Agotado")).toBeVisible();
    const btnAgregar = page.getByRole("button", { name: /agregar al carrito/i });
    await expect(btnAgregar).toBeDisabled();

    await finishEvidence(page, testInfo, "CP-17", "disponibilidad_sin_stock");
  });
});
