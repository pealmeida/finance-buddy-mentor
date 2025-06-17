
import { test, expect } from '@playwright/test';

test('login success', async ({ page }) => {
  await page.goto('/login');
  
  // Fill in login form
  await page.fill('input[type="email"]', 'test@example.com');
  await page.fill('input[type="password"]', 'password123');
  
  // Click login button
  await page.click('button[type="submit"]');
  
  // Check if redirected to dashboard
  await expect(page).toHaveURL('/dashboard');
});

test('login with invalid credentials shows error', async ({ page }) => {
  await page.goto('/login');
  
  // Fill in invalid credentials
  await page.fill('input[type="email"]', 'invalid@example.com');
  await page.fill('input[type="password"]', 'wrongpassword');
  
  // Click login button
  await page.click('button[type="submit"]');
  
  // Check for error message
  await expect(page.locator('.error-message, [role="alert"]')).toBeVisible();
});

test('login form validation', async ({ page }) => {
  await page.goto('/login');
  
  // Try to submit empty form
  await page.click('button[type="submit"]');
  
  // Check for validation messages
  await expect(page.locator('input[type="email"]:invalid')).toBeVisible();
});

test('password visibility toggle', async ({ page }) => {
  await page.goto('/login');
  
  const passwordInput = page.locator('input[type="password"]');
  const toggleButton = page.locator('[data-testid="password-toggle"], button[aria-label*="password"]');
  
  // Fill password
  await passwordInput.fill('testpassword');
  
  // Click toggle button if it exists
  if (await toggleButton.count() > 0) {
    await toggleButton.click();
    await expect(page.locator('input[type="text"]')).toBeVisible();
  }
});

test('remember me functionality', async ({ page }) => {
  await page.goto('/login');
  
  const rememberCheckbox = page.locator('input[type="checkbox"]');
  
  // Check remember me if it exists
  if (await rememberCheckbox.count() > 0) {
    await rememberCheckbox.check();
    await expect(rememberCheckbox).toBeChecked();
  }
});

test('navigation to signup page', async ({ page }) => {
  await page.goto('/login');
  
  // Look for signup link
  const signupLink = page.locator('a[href*="signup"], a:has-text("Sign up"), a:has-text("Register")');
  
  if (await signupLink.count() > 0) {
    await signupLink.click();
    await expect(page).toHaveURL(/.*signup.*/);
  }
});

test('forgot password link', async ({ page }) => {
  await page.goto('/login');
  
  // Look for forgot password link
  const forgotLink = page.locator('a:has-text("Forgot"), a:has-text("Reset")');
  
  if (await forgotLink.count() > 0) {
    await forgotLink.click();
    // Should navigate to password reset page or show modal
    await expect(page.locator('input[type="email"]')).toBeVisible();
  }
});
