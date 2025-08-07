import { test, expect } from '@playwright/test'

test('открыть страницу фильма', async ({ page }) => {
  await page.goto('/')
  await page.goto('/movie/1')
  await expect(page.getByRole('heading')).toBeVisible()
})


