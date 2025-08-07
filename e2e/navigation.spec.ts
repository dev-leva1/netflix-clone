import { test, expect } from '@playwright/test'

test('поиск → открыть фильм → вернуться назад', async ({ page }) => {
  await page.goto('/search?q=Интерстеллар')
  await page.waitForLoadState('networkidle')
  {
    const url = new URL(page.url())
    expect(url.pathname).toBe('/search')
    expect(url.searchParams.get('q')).toBe('Интерстеллар')
  }
  await page.waitForLoadState('networkidle')

  // Открываем первый фильм из результатов (заголовки карточек — h3)
  const firstCard = page.getByRole('gridcell').first()
  await firstCard.click()

  await expect(page).toHaveURL(/\/movie\/(\d+)/, { timeout: 15000 })
  // Проверяем наличие секции "Описание" на детальной
  await expect(page.getByRole('heading', { name: 'Описание' })).toBeVisible({ timeout: 15000 })

  // Возврат назад к поиску
  await page.goBack()
  {
    const url = new URL(page.url())
    expect(url.pathname).toBe('/search')
    expect(url.searchParams.get('q')).toBe('Интерстеллар')
  }
})


