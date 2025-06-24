import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';
const { writeFileSync } = require('fs');

const BASE_URL = 'http://localhost:8080';

async function logStep(page: Page, stepName: string, success: boolean) {
    const timestamp = new Date().toISOString();
    const logEntry = `${timestamp} - ${stepName}: ${success ? 'SUCCESS' : 'FAILED'}\n`;
    writeFileSync('C:\\Users\\pealm\\Code\\finance-buddy-mentor\\test-results\\execution.log', logEntry, { flag: 'a' });
}

async function fillEmail(page: Page, email: string) {
    try {
        const emailField = page.getByTestId('login-email-input');
        await expect(emailField).toBeVisible();
        await emailField.fill(email);
        await logStep(page, 'Fill Email', true);
    } catch (error) {
        await logStep(page, 'Fill Email', false);
        throw error;
    }
}

async function fillPassword(page: Page, password: string) {
    try {
        const passwordField = page.getByTestId('login-password-input');
        await expect(passwordField).toBeVisible();
        await passwordField.fill(password);
        await logStep(page, 'Fill Password', true);
    } catch (error) {
        await logStep(page, 'Fill Password', false);
        throw error;
    }
}

async function clickSignIn(page: Page) {
    try {
        const signInButton = page.getByTestId('login-submit-button');
        await expect(signInButton).toBeVisible();
        await signInButton.click();
        await logStep(page, 'Click Sign In', true);
    } catch (error) {
        await logStep(page, 'Click Sign In', false);
        throw error;
    }
}

async function saveTestReport(page: Page, testName: string) {
    const reportDir = 'C:\\Users\\pealm\\Code\\finance-buddy-mentor\\test-results';

    // Save screenshot
    const screenshotPath = `${reportDir}\\${testName}-${Date.now()}.png`;
    await page.screenshot({ path: screenshotPath });

    // Save execution log
    const logPath = `${reportDir}\\${testName}-${Date.now()}.log`;
    const logs = [
        `Test: ${testName}`,
        `Timestamp: ${new Date().toISOString()}`,
        `URL: ${page.url()}`,
        `Viewport: ${JSON.stringify(page.viewportSize())}`,
        `User Agent: ${await page.evaluate(() => navigator.userAgent)}`
    ].join('\n');

    writeFileSync(logPath, logs);
    console.log(`Test report saved to: ${screenshotPath}`);
    console.log(`Test logs saved to: ${logPath}`);
}

test('Successful login flow', async ({ page }) => {
    try {
        // Navigate to login page
        await page.goto(`${BASE_URL}/login`);
        await logStep(page, 'Navigate to Login Page', true);

        // Verify we're on the login page
        await expect(page).toHaveURL(`${BASE_URL}/login`);

        // Fill credentials
        await fillEmail(page, 'pealmeida96@gmail.com');
        await fillPassword(page, 'pedro123');

        await page.waitForTimeout(5000);

        // Submit form and wait for navigation
        await Promise.all([
            // Wait for navigation to dashboard
            page.waitForURL(`${BASE_URL}/dashboard`, {
                timeout: 15000 // 15 seconds timeout
            }),
            // Click the sign in button
            clickSignIn(page)
        ]);

        await logStep(page, 'Verify Dashboard Navigation', true);

        await page.waitForTimeout(5000);

        // Verify we're on the dashboard
        await expect(page).toHaveURL(`${BASE_URL}/dashboard`);

        // Wait for the page to be fully loaded
        await page.waitForLoadState('networkidle');

        await logStep(page, 'Test Completed', true);

        // Save test report
        await saveTestReport(page, 'login-success');
    } catch (error) {
        await logStep(page, 'Test Failed', false);

        // Capture debugging information
        const currentUrl = page.url();
        console.error(`Test failed. Current URL: ${currentUrl}`);

        // Check for any error messages on the page
        const errorMessages = await page.locator('[role="alert"]').allTextContents();
        if (errorMessages.length > 0) {
            console.error('Error messages found:', errorMessages);
        }

        // Save failure report
        await saveTestReport(page, 'login-failure');

        throw error;
    }
});
