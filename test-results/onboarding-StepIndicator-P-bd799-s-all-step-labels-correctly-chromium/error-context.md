# Test info

- Name: Progress Indicator Component >> renders all step labels correctly
- Location: C:\Users\pealm\Code\finance-buddy-mentor\tests\onboarding\StepIndicator.spec.ts:19:5

# Error details

```
Error: Timed out 5000ms waiting for expect(locator).toBeVisible()

Locator: getByText('Personal Info', { exact: true })
Expected: visible
Received: <element(s) not found>
Call log:
  - expect.toBeVisible with timeout 5000ms
  - waiting for getByText('Personal Info', { exact: true })

    at C:\Users\pealm\Code\finance-buddy-mentor\tests\onboarding\StepIndicator.spec.ts:21:71
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
- heading "Login to your account" [level=3]
- paragraph: Enter your credentials to access your Finance Buddy account
- text: Email
- img
- textbox "Email"
- text: Password
- img
- textbox "Password"
- button "Sign in"
- text: Don't have an account?
- link "Sign up":
  - /url: /signup
```

# Test source

```ts
   1 | import { test, expect } from '@playwright/test';
   2 |
   3 | test.describe('Progress Indicator Component', () => {
   4 |     const steps = [
   5 |         { id: 1, label: 'Personal Info', completed: false, current: true },
   6 |         { id: 2, label: 'Risk Profile', completed: false, current: false },
   7 |         { id: 3, label: 'Monthly Expenses', completed: false, current: false },
   8 |         { id: 4, label: 'Savings', completed: false, current: false },
   9 |         { id: 5, label: 'Debt Details', completed: false, current: false },
  10 |         { id: 6, label: 'Financial Goals', completed: false, current: false },
  11 |         { id: 7, label: 'Investments', completed: false, current: false },
  12 |         { id: 8, label: 'Review', completed: false, current: false },
  13 |     ];
  14 |
  15 |     test.beforeEach(async ({ page }) => {
  16 |         await page.goto('/onboarding');
  17 |     });
  18 |
  19 |     test('renders all step labels correctly', async ({ page }) => {
  20 |         for (const step of steps) {
> 21 |             await expect(page.getByText(step.label, { exact: true })).toBeVisible();
     |                                                                       ^ Error: Timed out 5000ms waiting for expect(locator).toBeVisible()
  22 |         }
  23 |     });
  24 |
  25 |     test('highlights the current step with blue background and bold text', async ({ page }) => {
  26 |         const currentStep = steps.find(step => step.current)!;
  27 |         const currentStepIndicator = page.locator(`[aria-current="step"]`);
  28 |
  29 |         await expect(currentStepIndicator).toHaveText(currentStep.id.toString());
  30 |         await expect(currentStepIndicator).toHaveClass(/bg-blue-500/);
  31 |         await expect(page.getByText(currentStep.label)).toHaveClass(/font-bold/);
  32 |     });
  33 |
  34 |     test('displays green checkmark for completed steps', async ({ page }) => {
  35 |         await page.getByRole('button', { name: 'Next' }).click();
  36 |         const completedStepIndicator = page.locator('[data-testid="step-1"]');
  37 |
  38 |         await expect(completedStepIndicator).toHaveClass(/bg-green-500/);
  39 |         await expect(completedStepIndicator.locator('svg')).toBeVisible();
  40 |     });
  41 |
  42 |     test('updates progress bar width accurately when advancing steps', async ({ page }) => {
  43 |         const progressBar = page.locator('[role="progressbar"] > div');
  44 |
  45 |         // Verify initial state (0%)
  46 |         await expect(progressBar).toHaveCSS('width', '0%');
  47 |
  48 |         // Advance to step 2 and verify (14.2857%)
  49 |         await page.getByRole('button', { name: 'Next' }).click();
  50 |         await expect(progressBar).toHaveCSS('width', '14.2857%');
  51 |     });
  52 |
  53 |     test('meets accessibility standards with proper ARIA attributes', async ({ page }) => {
  54 |         await expect(page.locator('[aria-current="step"]')).toHaveAttribute('aria-current', 'step');
  55 |         await expect(page.locator('[role="progressbar"]')).toBeVisible();
  56 |     });
  57 | }); 
```