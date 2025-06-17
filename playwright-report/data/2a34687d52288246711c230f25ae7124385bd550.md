# Test info

- Name: should navigate from login to signup via button click
- Location: C:\Users\pealm\Code\finance-buddy-mentor\tests\authentication\signup.test.ts:6:1

# Error details

```
Error: page.waitForURL: Test timeout of 30000ms exceeded.
=========================== logs ===========================
waiting for navigation to "http://localhost:8080/onboarding" until "load"
============================================================
    at C:\Users\pealm\Code\finance-buddy-mentor\tests\authentication\signup.test.ts:44:16
```

# Page snapshot

```yaml
- region "Notifications (F8)":
  - list
- banner:
  - link "Finance Buddy":
    - /url: /
    - img
    - text: Finance Buddy
  - button "EN":
    - img
    - text: EN
- heading "Create an account" [level=3]
- paragraph: Enter your information to get started with Finance Buddy
- text: Full Name
- img
- textbox "Full Name": Test User 2
- text: Email
- img
- textbox "Email": test2@test.com
- text: Password
- img
- textbox "Password": test234
- button "Create account"
- text: Already have an account?
- link "Sign in":
  - /url: /login
```

# Test source

```ts
   1 | import { test, expect } from '@playwright/test';
   2 | import { navigateToSignup, fillSignupForm } from '../helpers/test-helpers';
   3 |
   4 | const BASE_URL = 'http://localhost:8080';
   5 |
   6 | test('should navigate from login to signup via button click', async ({ page }) => {
   7 |     // 1. Load login page
   8 |     await page.goto(`${BASE_URL}/login`);
   9 |
  10 |     // 2. Locate and click the signup button
  11 |     const signupButton = page.getByTestId('signup-navigation-link');
  12 |     await expect(signupButton).toBeVisible();
  13 |     await signupButton.click();
  14 |
  15 |     // 3. Verify navigation
  16 |     await expect(page).toHaveURL(`${BASE_URL}/signup`);
  17 |     await page.waitForTimeout(5000); // Brief pause for visual confirmation
  18 |
  19 |     // 5. Capture screenshot
  20 |     await page.screenshot({
  21 |         path: 'tests/screenshots/signup-flow.png',
  22 |         fullPage: true,
  23 |     });
  24 |
  25 |     // Locate elements
  26 |     const nameInput = page.getByTestId('signup-name-input');
  27 |     const emailInput = page.getByTestId('signup-email-input');
  28 |     const passwordInput = page.getByTestId('signup-password-input');
  29 |     const submitButton = page.getByTestId('signup-submit-button');
  30 |
  31 |     // Fill the form
  32 |     await nameInput.fill('Test User 2');
  33 |     await emailInput.fill('test2@test.com');
  34 |     await passwordInput.fill('test234');
  35 |     await page.waitForTimeout(5000);
  36 |
  37 |     await page.screenshot({
  38 |         path: 'tests/screenshots/signup-flow-form-filled.png',
  39 |         fullPage: true,
  40 |     });
  41 |
  42 |     // Submit and wait for navigation
  43 |     await submitButton.click();
> 44 |     await page.waitForURL(`${BASE_URL}/onboarding`); // Ensures navigation completes
     |                ^ Error: page.waitForURL: Test timeout of 30000ms exceeded.
  45 |     await page.waitForTimeout(5000);
  46 |
  47 |     await page.screenshot({
  48 |         path: 'tests/screenshots/signup-flow-onboarding.png',
  49 |         fullPage: true,
  50 |     });
  51 | });
```