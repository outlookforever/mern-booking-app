import { test, expect } from '@playwright/test';
import path from 'path'


const UI_URL = "http://localhost:5173"

test.beforeEach('', async({page}) => {
  await page.goto(UI_URL)

  await page.getByRole('link', { name: "Sign In" }).click()

  await expect(page.getByRole('heading', { name: 'Sign In'})).toBeVisible()

  await page.locator('[name=email]').fill('test@test.ru')
  await page.locator('[name=password]').fill('123123')

  await page.getByRole('button', {name: 'Login'}).click()

  await expect(page.getByText('Login Success')).toBeVisible()
})

test("Should show hotel search result", async ({page}) => {
  await page.goto(UI_URL)

  await page.getByPlaceholder("Where are you going").fill('Dublin')
  await page.getByRole('button', {name: 'Search'} ).click()

  await expect(page.getByText('1 Hotels found in Dublin')).toBeVisible()
  await expect(page.getByText('Dublin Getaways')).toBeVisible()

})
