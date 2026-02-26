import { test, expect } from '@playwright/test'

test.describe('Purchase Flow', () => {
  test('landing page loads with hero and CTA', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('h1')).toBeVisible()
    await expect(page.getByRole('link', { name: /catálogo|personalizar|crear/i })).toBeVisible()
  })

  test('catalog page shows books', async ({ page }) => {
    await page.goto('/catalogo')
    await expect(page.locator('h1')).toContainText('Catálogo')
  })

  test('wizard step 1 — name input', async ({ page }) => {
    await page.goto('/wizard/paso-1')
    const nameInput = page.getByPlaceholder(/nombre/i)
    await expect(nameInput).toBeVisible()

    await nameInput.fill('Sofía')
    await expect(nameInput).toHaveValue('Sofía')

    // Continue button should be enabled with valid name
    const continueBtn = page.getByRole('link', { name: /siguiente|continuar/i })
    await expect(continueBtn).toBeVisible()
  })

  test('wizard step 2 — character selection', async ({ page }) => {
    // Set name in localStorage to simulate step 1 completion
    await page.goto('/wizard/paso-1')
    await page.getByPlaceholder(/nombre/i).fill('Sofía')

    await page.goto('/wizard/paso-2')
    await expect(page.locator('h1, h2').first()).toBeVisible()
  })

  test('wizard step 3 — dedication', async ({ page }) => {
    await page.goto('/wizard/paso-3')
    const textarea = page.locator('textarea')
    await expect(textarea).toBeVisible()

    await textarea.fill('Para mi princesa Sofía')
    await expect(textarea).toHaveValue('Para mi princesa Sofía')
  })

  test('wizard step 4 — summary', async ({ page }) => {
    await page.goto('/wizard/paso-4')
    await expect(page.locator('h1, h2').first()).toBeVisible()
  })

  test('preview page loads', async ({ page }) => {
    await page.goto('/preview')
    await expect(page.locator('body')).toBeVisible()
  })

  test('checkout page loads with form', async ({ page }) => {
    await page.goto('/checkout')
    // Should have email, name, address fields
    await expect(page.locator('input')).toHaveCount({ minimum: 3 })
  })

  test('success page shows confirmation', async ({ page }) => {
    await page.goto('/pago/success')
    await expect(page.getByText(/confirmado|éxito/i)).toBeVisible()
  })

  test('failure page shows retry option', async ({ page }) => {
    await page.goto('/pago/failure')
    await expect(page.getByText(/no completado|problema/i)).toBeVisible()
    await expect(page.getByRole('link', { name: /intentar|reintentar/i })).toBeVisible()
  })

  test('404 page shows friendly message', async ({ page }) => {
    await page.goto('/pagina-que-no-existe')
    await expect(page.getByText(/no encontrada/i)).toBeVisible()
  })
})

test.describe('Admin Access', () => {
  test('admin login page loads', async ({ page }) => {
    await page.goto('/admin/login')
    await expect(page.locator('input[type="email"]')).toBeVisible()
    await expect(page.locator('input[type="password"]')).toBeVisible()
  })

  test('admin redirects unauthenticated users', async ({ page }) => {
    await page.goto('/admin/dashboard')
    // Should be redirected to login
    await expect(page).toHaveURL(/login/)
  })
})

test.describe('SEO', () => {
  test('homepage has meta tags', async ({ page }) => {
    await page.goto('/')
    const title = await page.title()
    expect(title).toContain('Tipiti Books')

    const description = page.locator('meta[name="description"]')
    await expect(description).toHaveAttribute('content', /libros infantiles personalizados/i)
  })

  test('robots.txt is accessible', async ({ page }) => {
    const response = await page.goto('/robots.txt')
    expect(response?.status()).toBe(200)
  })

  test('sitemap.xml is accessible', async ({ page }) => {
    const response = await page.goto('/sitemap.xml')
    expect(response?.status()).toBe(200)
  })
})
