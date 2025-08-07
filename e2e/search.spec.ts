import { test, expect } from '@playwright/test'

test('поиск и открытие страницы поиска', async ({ page }) => {
  await page.goto('/')
  await page.getByLabel('Поиск фильмов').fill('test')
  await page.keyboard.press('Enter')
  await expect(page).toHaveURL(/\/search\?q=test/)
})


