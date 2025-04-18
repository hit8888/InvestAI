import { test, expect } from '@playwright/test';

test.describe('Basic flow for agent', () => {
  test.setTimeout(60000); // Set timeout for this test suite

  // Add setup for each test
  test.beforeEach(async ({ context }) => {
    // Clear all cookies and localStorage before each test
    await context.clearCookies();

    // You can also clear localStorage if needed
    await context.addInitScript(() => {
      window.localStorage.clear();
    });
  });

  test('should complete contact form flow', async ({ page }) => {
    // 1. Setup - Add test data
    const TEST_EMAIL = 'test@getbreakout.ai';
    const TEST_NAME = 'test automation';

    // 2. Navigate to the page with proper waiting
    await test.step('Navigate to page', async () => {
      await page.goto(
        'https://agent.getbreakout.ai/org/hubspot/agent/2/?config=multimedia&showGlass=true&is_test=true&test_type=automated',
        {
          waitUntil: 'networkidle',
          timeout: 30000,
        },
      );
    });

    // 3. Interact with the chat flow with proper steps
    await test.step('Complete chat flow', async () => {
      // Wait for and click greeting banner
      const greetingBanner = page.getByTestId('greeting-banner');
      await expect(greetingBanner).toBeVisible({ timeout: 30000 });
      await greetingBanner.getByRole('button').click();

      // Wait for and click first suggestion
      const firstSuggestion = page.getByTestId('suggestion-item-0');
      await expect(firstSuggestion).toBeVisible({ timeout: 40000 });

      // Add small delay before clicking to ensure element is fully ready
      await page.waitForTimeout(1000);
      await firstSuggestion.click({ force: true });

      // Click contact button
      // Wait for 10 seconds - AI Message + suggested questions UI rendering - Network Might be slow
      await page.waitForTimeout(10000);
      const contactButton = page.getByTestId('contact-sales-btn');
      await expect(contactButton).toBeVisible({ timeout: 30000 });
      await contactButton.click();

      // Wait for and fill form
      const contactForm = page.getByTestId('contact-form');
      await expect(contactForm).toBeVisible({ timeout: 30000 });

      // Fill form fields with retry mechanism
      const nameField = page.getByRole('textbox', { name: 'Name*' });
      const emailField = page.getByRole('textbox', { name: 'Email*' });

      await expect(nameField).toBeVisible({ timeout: 30000 });
      await expect(emailField).toBeVisible({ timeout: 30000 });

      await nameField.fill(TEST_NAME);
      await emailField.fill(TEST_EMAIL);

      // Submit form
      const submitButton = page.getByTestId('submit-form-btn');
      await expect(submitButton).toBeEnabled({ timeout: 30000 });
      await submitButton.click();

      // Verify success messages with better timeout
      await expect(page.getByText('Thank you for sharing your details!')).toBeVisible({
        timeout: 30000,
      });
      await expect(page.getByText("Great, We've received your responses.")).toBeVisible({
        timeout: 30000,
      });
    });
  });

  // Add cleanup after each test if needed
  test.afterEach(async ({ page }) => {
    // Close any dialogs that might be open
    try {
      await page.close();
    } catch (e) {
      console.log('Error during cleanup:', e);
    }
  });
});
