import { test, expect } from '@playwright/test'

test('поиск → открыть фильм → вернуться назад', async ({ page }) => {
  await page.goto('/')

  const input = page.getByLabel('Поиск фильмов')
  if (!(await input.isVisible())) {
    await page.getByRole('button', { name: 'Показать поиск' }).click()
    await expect(input).toBeVisible()
  }

  await input.fill('test')
  await page.keyboard.press('Enter')
  await expect(page).toHaveURL(/\/search\?q=test/)

  // Открываем первый фильм из результатов (заголовки карточек — h3)
  const firstTitle = page.getByRole('heading', { level: 3 }).first()
  await firstTitle.click()

  await expect(page).toHaveURL(/\/movie\/(\d+)/)
  // Проверяем наличие секции "Описание" на детальной
  await expect(page.getByRole('heading', { name: 'Описание' })).toBeVisible()

  // Возврат назад к поиску
  await page.goBack()
  await expect(page).toHaveURL(/\/search\?q=test/)
})


