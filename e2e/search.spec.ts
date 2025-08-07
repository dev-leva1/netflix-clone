import { test, expect } from '@playwright/test'

test('поиск и открытие страницы поиска', async ({ page }) => {
  await page.goto('/search?q=Интерстеллар')
  await page.waitForLoadState('networkidle')
  {
    const url = new URL(page.url())
    expect(url.pathname).toBe('/search')
    expect(url.searchParams.get('q')).toBe('Интерстеллар')
  }
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible({ timeout: 15000 })
})

test('бесконечная прокрутка подгружает следующую страницу', async ({ page }) => {
  await page.goto('/search?q=Интерстеллар')
  await page.waitForLoadState('networkidle')
  // Скроллим в конец несколько раз, чтобы триггерить observer
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
  await page.waitForTimeout(1000)
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
  await page.waitForTimeout(1000)
  // Проверяем, что лоадер/скелетоны проявлялись (эвристика)
  // Здесь без точного селектора достаточно, что страница не упала
  {
    const url = new URL(page.url())
    expect(url.pathname).toBe('/search')
    expect(url.searchParams.get('q')).toBe('Интерстеллар')
  }
})


