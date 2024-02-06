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

test('should allow user wto add a hotel', async({page}) => {
  await page.goto(`${UI_URL}/add-hotel`)

  await page.locator('[name="name"]').fill('Test Hotel')
  await page.locator('[name="city"]').fill('Test City')
  await page.locator('[name="country"]').fill('Test Country')
  await page.locator('[name="description"]').fill('Test description')
  await page.locator('[name="pricePerNight"]').fill('100')
  await page.selectOption('select[name="starRating"]', "3")
  await page.getByText("Budget").click()
  await page.getByLabel("Free WiFi").check()
  await page.getByLabel("Parking").check()
  await page.locator('[name="adultCount"]').fill('2')
  await page.locator('[name="childrenCount"]').fill('3')
  await page.setInputFiles('[name="imageFiles"]', [ 
    path.join(__dirname, 'files', '001.jpg'),
    path.join(__dirname, 'files', '002.jpg'),
    path.join(__dirname, 'files', '003.jpg'),
  ])

  await page.getByRole('button', {name: 'Save'}).click()
  await expect(page.getByText('Hotel Saved!')).toBeVisible()
})