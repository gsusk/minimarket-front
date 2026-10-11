import { expect, test } from "@playwright/test";
import { finishEvidence } from "./support/evidence";

test.describe("Carrito", () => {
  test("CP-01 - acceder a un producto y anadirlo al carrito", async ({ page }, testInfo) => {
    await page.goto("/product/1/smart-tv-samsung-oled-65-4k-qn65s90c");

    const btnAgregar = page.getByRole("button", { name: /agregar al carrito/i });
    await expect(btnAgregar).toBeEnabled();

    await btnAgregar.click();

    await expect(page.getByTestId("cart-drawer")).toBeVisible({ timeout: 5000 });
    await expect(page.getByTestId("cart-drawer").getByRole("listitem").first()).toBeVisible();

    await finishEvidence(page, testInfo, "CP-01", "carrito_agregar_producto");
  });

  test("CP-02 - modificar cantidades y eliminar producto del carrito", async ({ page }, testInfo) => {
    await page.goto("/product/3/smart-tv-sony-bravia-xr-75-x90l-full-array-led");
    await page.waitForLoadState("networkidle");
    await page.getByRole("button", { name: /agregar al carrito/i }).click();

    const drawer = page.getByTestId("cart-drawer");
    await expect(drawer).toBeVisible({ timeout: 5000 });

    const btnMas = drawer.getByRole("button", { name: /agregar una unidad/i }).first();
    await btnMas.click();

    await expect(drawer.getByText("2", { exact: true })).toBeVisible({ timeout: 8000 });

    const btnEliminar = drawer.getByRole("button", { name: /eliminar.*del carrito/i }).first();
    await btnEliminar.click();

    await expect(page.getByText(/Tu carrito esta vacio/i)).toBeVisible({ timeout: 5000 });

    await finishEvidence(page, testInfo, "CP-02", "carrito_modificar_eliminar");
  });
});
