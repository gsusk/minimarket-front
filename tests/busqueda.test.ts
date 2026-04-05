import { expect, test } from "@playwright/test"

test.describe("Busqueda de productos", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/")
    await page.waitForLoadState("networkidle")
    const locator = page.getByRole("combobox").first()
    await locator.fill('libro')
    await locator.press('Enter')
    await page.waitForLoadState("domcontentloaded")
  })

  test("Debe mostrar los resultados relevantes respecto a la busqueda, junto a la barra de filtros", async ({ page }) => {
    await page.waitForTimeout(1000)
    await expect(page.getByTestId("product-card").first()).toBeVisible();
    await expect(page.getByTestId("filter-bar")).toBeVisible();
    await expect(page.getByTestId("filter-bar")).toContainText(/categor[ií]a/i);
    await expect(page.getByTestId("filter-bar")).toContainText(/precio/i);
  })

  test("Debe redirigir a la pagina del producto seleccionado", async ({ page }) => {
    const cardLocator = page.getByTestId("product-card").first()
    const productLink = cardLocator.getByRole("link").last()
    const href = await productLink.getAttribute("href")

    await productLink.click({ force: true })

    await expect(page).toHaveURL(new RegExp(href!))
  })

  test('Validar busqueda vacia devuelve redireccion al inicio', async ({ page }) => {
    // Si no hay q ni category debe redirigir a; inicio
    await page.goto('/search?q=').catch((e) => {
      if (!e.message.includes("NS_BINDING_ABORTED")) throw e;
    });

    await expect(page).toHaveURL('http://localhost:3000/');
  });

  test('Debe aplicar un filtro interactuando con las opciones laterales y actualizar la url', async ({ page }) => {
    await page.waitForTimeout(1000);

    const filterBar = page.getByTestId("filter-bar");
    const filterOption = filterBar.locator('.MuiTypography-body2').filter({ hasNotText: '--' }).first();
    const optionText = await filterOption.textContent();
    console.log(`filtro a aplicar: ${optionText}`);

    await filterOption.click();

    await expect(page).not.toHaveURL('http://localhost:3000/search?q=libro');

    expect(page.url()).toMatch(/(&category=|&brand=|&.*=)/);
  });

  test('Busqueda sin resultados', async ({ page }) => {
    await page.waitForTimeout(1000);
    await page.goto('/search?q=textoaleatorio').catch((e) => {
      if (!e.message.includes("NS_BINDING_ABORTED")) throw e;
    });
    await page.waitForTimeout(1000);

    await expect(page.getByText(/no se hallaron resultados/i)).toBeVisible();
  });
})