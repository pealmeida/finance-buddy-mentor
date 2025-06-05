import { test, expect } from '@playwright/test';
import { navigateToSignup, fillSignupForm } from '../helpers/test-helpers';

const BASE_URL = 'http://localhost:8080';

test('should navigate from login to signup via button click', async ({ page }) => {
    // 1. Load login page
    await page.goto(`${BASE_URL}/login`);

    // 2. Locate and click the signup button
    const signupButton = page.getByTestId('signup-navigation-link');
    await expect(signupButton).toBeVisible();
    await signupButton.click();

    // 3. Verify navigation
    await expect(page).toHaveURL(`${BASE_URL}/signup`);
    await page.waitForTimeout(5000); // Brief pause for visual confirmation

    // 5. Capture screenshot
    await page.screenshot({
        path: 'tests/screenshots/signup-flow.png',
        fullPage: true,
    });

    // Locate elements
    const nameInput = page.getByTestId('signup-name-input');
    const emailInput = page.getByTestId('signup-email-input');
    const passwordInput = page.getByTestId('signup-password-input');
    const submitButton = page.getByTestId('signup-submit-button');

    // Fill the form
    await nameInput.fill('John Doe');
    await emailInput.fill('john.doe@example.com');
    await passwordInput.fill('SecurePass123!');
    await page.waitForTimeout(5000);

    await page.screenshot({
        path: 'tests/screenshots/signup-flow-form-filled.png',
        fullPage: true,
    });

    // Submit and wait for navigation
    await submitButton.click();
    await page.waitForURL(`${BASE_URL}/onboarding`); // Ensures navigation completes
    await page.waitForTimeout(5000);

    await page.screenshot({
        path: 'tests/screenshots/signup-flow-onboarding.png',
        fullPage: true,
    });
});