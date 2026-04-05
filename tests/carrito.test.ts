import { expect, test } from "@playwright/test"

test.describe("Agregar Producto al Carrito", () => {

  test("Debería acceder a un producto y añadirlo al carrito exitosamente", async ({ page }) => {
    await page.goto("/product/1/smart-tv-samsung-oled-65-4k-qn65s90c");

    const btnAgregar = page.getByRole("button", { name: /agregar al carrito/i });
    await expect(btnAgregar).toBeEnabled();

    await btnAgregar.click();

    await expect(page.getByTestId("cart-drawer")).toBeVisible({ timeout: 5000 });
    await expect(page.getByTestId("cart-drawer").getByRole("listitem").first()).toBeVisible();
  });

  test("Modificar cantidades y eliminar producto del carrito", async ({ page }) => {
    await page.goto("/product/2/smart-tv-lg-c3-oled-55-4k-evo");
    await page.getByRole("button", { name: /agregar al carrito/i }).click();

    const drawer = page.getByTestId("cart-drawer");
    await expect(drawer).toBeVisible();

    const btnMas = drawer.getByRole("button", { name: /agregar una unidad/i }).first();
    await btnMas.click();

    await expect(drawer.getByText("2", { exact: true })).toBeVisible({ timeout: 5000 });

    const btnEliminar = drawer.getByRole("button", { name: /eliminar.*del carrito/i }).first();
    await btnEliminar.click();

    // el carro aca deberia quedar vacio
    await expect(page.getByText(/Tu carrito esta vacio/i)).toBeVisible();
  });
});
