import { test, expect } from '@playwright/test';

const UI_URL = "http://localhost:5173"

test('should allow the user to sign in', async ({ page }) => {
  await page.goto(UI_URL)

  // нажимаем на кнопку Sign In
  await page.getByRole('link', { name: "Sign In" }).click()

  // проверим на наличие заголовка Sign In; toBeVisible - чтобы она была видна
  await expect(page.getByRole('heading', { name: 'Sign In'})).toBeVisible()

  // введем адрес эл.почты и пароль
  await page.locator('[name=email]').fill('test@test.ru')
  await page.locator('[name=password]').fill('123123')

  // нажимаем кнопку входа в систему
  await page.getByRole('button', {name: 'Login'}).click()

  // добавим несколько утверждений которые скажут нам что пользователь вошел в систему
  // проверим на то что появиться текст Login Success, и отобразятся ссылки и кнопка выйти
  await expect(page.getByText('Login Success')).toBeVisible()
  await expect(page.getByRole('link', { name: 'My Bookings'})).toBeVisible()
  await expect(page.getByRole('link', { name: 'My Hotels'})).toBeVisible()
  await expect(page.getByRole('button', { name: 'Sign Out'})).toBeVisible()
});

test('should the user to registration', async ({page}) => {
  //генерируем случайный эл. адрес
  const registerEmail = `test${Math.floor(Math.random() * 9000) + 1000}@test.ru`
  await page.goto(UI_URL)

  await page.getByRole('link', { name: "Sign In" }).click() 
  await page.getByRole('link', {name: 'Create an account here'}).click()

  await expect(page.getByRole('heading', { name: 'Create an account'})).toBeVisible()

  await page.locator('[name=firstName]').fill('Les')
  await page.locator('[name=lastName]').fill('Paul')
  await page.locator('[name=email]').fill(registerEmail)
  await page.locator('[name=password]').fill('123123')
  await page.locator('[name=confirmPassword]').fill('123123')

  await page.getByRole('button', {name: 'Create Account'}).click()

  await expect(page.getByText('Registration Success')).toBeVisible()
  await expect(page.getByRole('link', { name: 'My Bookings'})).toBeVisible()
  await expect(page.getByRole('link', { name: 'My Hotels'})).toBeVisible()
  await expect(page.getByRole('button', { name: 'Sign Out'})).toBeVisible()
})
