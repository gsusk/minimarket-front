import { test, expect } from "@playwright/test"

test.describe("registrar usuario", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/register")
  })

  test.skip("Campos de registro existen", async ({ page }) => {
    await expect(page.locator('input[name="email"]')).toBeVisible()
    await expect(page.locator('input[name="password"]')).toBeVisible()
    await expect(page.locator('input[name="firstName"]')).toBeVisible()
    await expect(page.locator('input[name="lastName"]')).toBeVisible()
  })

  test("Los campos muestran error si usuario intenta enviarlos en blanco", async ({ page }) => {
    await page.getByRole("button", { name: /registrarme/i }).click()

    await expect(page.getByText("First Name is required")).toBeVisible()
    await expect(page.getByText("Last Name is required")).toBeVisible()
    await expect(page.getByText("Email is required")).toBeVisible()
    await expect(page.getByText("Password is required")).toBeVisible()
  })

  test("Los campos muestran error cuando el usuario diligencia mal los datos", async ({ page }) => {
    await page.fill('input[name="email"]', 'x@xx.x_!')
    await page.fill('input[name="password"]', '123') //  menos de6 letras
    await page.fill('input[name="firstName"]', "a")
    await page.fill('input[name="lastName"]', "b")

    await page.getByRole("button", { name: /registrarme/i }).click()

    await expect(page.getByText("Needs to be a valid email")).toBeVisible()
    await expect(page.getByText("at least 6 characters")).toBeVisible()
    await expect(page.getByText("Need to be at least 2 characters")).toHaveCount(2)
  })

  test("debería registrar un usuario exitosamente con datos válidos", async ({ page }) => {
    const uniqueEmail = `test_${Date.now()}@gmail.com`;

    await page.goto("/register")

    await page.fill('input[name="email"]', uniqueEmail)
    await page.fill('input[name="password"]', '123456')
    await page.fill('input[name="firstName"]', "test")
    await page.fill('input[name="lastName"]', "person")

    await page.getByRole("button", { name: /registrarme/i }).click()
    await expect(page).toHaveURL("/")
    await expect(page.getByText(/ofertas/i)).toBeVisible()
  })

})