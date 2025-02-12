import { test, expect } from '@playwright/test';

test('Basic flow for agent', async ({ page }) => {
  // 1. Setup - Add test data
  const TEST_EMAIL = 'test@getbreakout.ai';
  const TEST_NAME = 'test automation';

  // 2. Navigate to the page
  await page.goto(
    'https://agent.meaku.ai/org/hackerearth/agent/1/?config=multimedia&showGlass=true&is_test=true&test_type=automated',
  );

  // 3. Interact with the chat flow
  await expect(page.getByTestId('greeting-banner')).toBeVisible();
  await page.getByTestId('greeting-banner').getByRole('button').click();

  // Wait for suggestions to be loaded and verify we have at least one
  const initiialFirstSuggestion = page.getByTestId('suggestion-item-0');
  await expect(initiialFirstSuggestion).toBeVisible();

  // Click the first suggestion with better waiting and force
  await initiialFirstSuggestion.waitFor({ state: 'visible', timeout: 30000 });
  await initiialFirstSuggestion.click({ force: true, timeout: 30000 });

  // Add assertion to verify the slide container
  // await expect(page.getByAltText('Slide')).toBeVisible(); //Disabled for now! We started getting video instead of slide. Need to think through this.

  const contactButton = page.getByTestId('contact-sales-btn');
  await contactButton.click();

  // Wait for form to be visible
  const contactForm = page.getByTestId('contact-form');
  await expect(contactForm).toBeVisible();

  // Fill form
  await page.getByRole('textbox', { name: 'Name' }).fill(TEST_NAME);
  await page.getByRole('textbox', { name: 'Email' }).fill(TEST_EMAIL);

  // Submit form
  await page.getByTestId('submit-form-btn').click();

  // Verify success message
  const successMessage = page.getByText('Thank You for Sharing Your Details!');
  await expect(successMessage).toBeVisible();

  //Verify BE acknowledgemeant text
  const acknowledgementText = page.getByText("Great, We've received your responses.");
  await expect(acknowledgementText).toBeVisible();

  // Wait for suggestions to be loaded and verify we have at least one
  const firstSuggestion = page.getByTestId('suggestion-item-0');
  await expect(firstSuggestion).toBeVisible();
});
