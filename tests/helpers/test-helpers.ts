import { Page } from '@playwright/test';
import { expect } from '@playwright/test';

const BASE_URL = 'http://localhost:8080';

export async function navigateToSignup(page: Page) {
    await page.goto(`${BASE_URL}/login`);
    await page.getByTestId('signup-link').click();
    await expect(page).toHaveURL(`${BASE_URL}/signup`);
    await expect(page.getByTestId('signup-page')).toBeVisible();
}

export async function fillSignupForm(page: Page, email: string, password: string) {
    await page.getByTestId('email-input').fill(email);
    await page.getByTestId('password-input').fill(password);
}