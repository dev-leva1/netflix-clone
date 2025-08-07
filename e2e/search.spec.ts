import { test, expect } from '@playwright/test'

test('поиск и открытие страницы поиска', async ({ page }) => {
  await page.goto('/')
  const input = page.getByLabel('Поиск фильмов')
  if (!(await input.isVisible())) {
    await page.getByRole('button', { name: 'Показать поиск' }).click()
    await expect(input).toBeVisible()
  }
  await input.fill('test')
  await page.keyboard.press('Enter')
  await expect(page).toHaveURL(/\/search\?q=test/)
})


