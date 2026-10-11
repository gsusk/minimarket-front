import { expect, test } from "@playwright/test";
import { finishEvidence } from "./support/evidence";

test.describe("Busqueda de productos", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    const locator = page.getByRole("combobox").first();
    await locator.fill("libro");
    await locator.press("Enter");
    await page.waitForLoadState("domcontentloaded");
  });

  test("CP-03 - mostrar resultados relevantes y barra de filtros", async ({ page }, testInfo) => {
    await page.waitForTimeout(1000);
    await expect(page.getByTestId("product-card").first()).toBeVisible();
    await expect(page.getByTestId("filter-bar")).toBeVisible();
    await expect(page.getByTestId("filter-bar")).toContainText(/categor[ií]a/i);
    await expect(page.getByTestId("filter-bar")).toContainText(/precio/i);

    await finishEvidence(page, testInfo, "CP-03", "busqueda_resultados_filtros");
  });

  test("CP-04 - redirigir a la pagina del producto seleccionado", async ({ page }, testInfo) => {
    const cardLocator = page.getByTestId("product-card").first();
    const productLink = cardLocator.getByRole("link").last();
    const href = await productLink.getAttribute("href");

    await productLink.click({ force: true });

    await expect(page).toHaveURL(new RegExp(href!));

    await finishEvidence(page, testInfo, "CP-04", "busqueda_detalle_producto");
  });

  test("CP-05 - buscar sin criterios validos", async ({ page }, testInfo) => {
    await page.goto("/search?q=").catch((error) => {
      if (!error.message.includes("NS_BINDING_ABORTED")) throw error;
    });

    await expect(page).toHaveURL("http://localhost:3000/");

    await finishEvidence(page, testInfo, "CP-05", "busqueda_vacia_redireccion");
  });

  test("CP-06 - aplicar filtro lateral y actualizar URL", async ({ page }, testInfo) => {
    await page.waitForTimeout(1000);

    const filterBar = page.getByTestId("filter-bar");
    const filterOption = filterBar.locator(".MuiTypography-body2").filter({ hasNotText: "--" }).first();

    await filterOption.click();

    await expect(page).not.toHaveURL("http://localhost:3000/search?q=libro");
    expect(page.url()).toMatch(/(&category=|&brand=|&.*=)/);

    await finishEvidence(page, testInfo, "CP-06", "busqueda_filtro_url");
  });

  test("CP-07 - realizar busqueda sin resultados", async ({ page }, testInfo) => {
    await page.waitForTimeout(1000);
    await page.goto("/search?q=textoaleatorio").catch((error) => {
      if (!error.message.includes("NS_BINDING_ABORTED")) throw error;
    });
    await page.waitForTimeout(1000);

    await expect(page.getByText(/no se hallaron resultados/i)).toBeVisible();

    await finishEvidence(page, testInfo, "CP-07", "busqueda_sin_resultados");
  });
});
