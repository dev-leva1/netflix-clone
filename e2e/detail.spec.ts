import { test, expect } from '@playwright/test'

test('открыть страницу фильма', async ({ page }) => {
  await page.goto('/')
  await page.waitForLoadState('domcontentloaded')
  await page.goto('/movie/1')
  await page.waitForLoadState('networkidle')
  // Проверяем наличие секции "Описание" как стабильного маркера деталей
  await expect(page.getByRole('heading', { name: 'Описание' })).toBeVisible({ timeout: 30000 })
})


