import { test, expect } from '@playwright/test';

test.describe('Progress Indicator Component', () => {
    const steps = [
        { id: 1, label: 'Personal Info', completed: false, current: true },
        { id: 2, label: 'Risk Profile', completed: false, current: false },
        { id: 3, label: 'Monthly Expenses', completed: false, current: false },
        { id: 4, label: 'Savings', completed: false, current: false },
        { id: 5, label: 'Debt Details', completed: false, current: false },
        { id: 6, label: 'Financial Goals', completed: false, current: false },
        { id: 7, label: 'Investments', completed: false, current: false },
        { id: 8, label: 'Review', completed: false, current: false },
    ];

    test.beforeEach(async ({ page }) => {
        await page.goto('/onboarding');
    });

    test('renders all step labels correctly', async ({ page }) => {
        for (const step of steps) {
            await expect(page.getByText(step.label, { exact: true })).toBeVisible();
        }
    });

    test('highlights the current step with blue background and bold text', async ({ page }) => {
        const currentStep = steps.find(step => step.current)!;
        const currentStepIndicator = page.locator(`[aria-current="step"]`);

        await expect(currentStepIndicator).toHaveText(currentStep.id.toString());
        await expect(currentStepIndicator).toHaveClass(/bg-blue-500/);
        await expect(page.getByText(currentStep.label)).toHaveClass(/font-bold/);
    });

    test('displays green checkmark for completed steps', async ({ page }) => {
        await page.getByRole('button', { name: 'Next' }).click();
        const completedStepIndicator = page.locator('[data-testid="step-1"]');

        await expect(completedStepIndicator).toHaveClass(/bg-green-500/);
        await expect(completedStepIndicator.locator('svg')).toBeVisible();
    });

    test('updates progress bar width accurately when advancing steps', async ({ page }) => {
        const progressBar = page.locator('[role="progressbar"] > div');

        // Verify initial state (0%)
        await expect(progressBar).toHaveCSS('width', '0%');

        // Advance to step 2 and verify (14.2857%)
        await page.getByRole('button', { name: 'Next' }).click();
        await expect(progressBar).toHaveCSS('width', '14.2857%');
    });

    test('meets accessibility standards with proper ARIA attributes', async ({ page }) => {
        await expect(page.locator('[aria-current="step"]')).toHaveAttribute('aria-current', 'step');
        await expect(page.locator('[role="progressbar"]')).toBeVisible();
    });
}); 