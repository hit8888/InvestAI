import { test, expect } from '@playwright/test';

test('Basic flow for agent', async ({ page }) => {
  // 1. Setup - Add test data
  const TEST_EMAIL = 'test@getbreakout.ai';
  const TEST_NAME = 'test automation';

  // 2. Navigate to the page
  await page.goto(
    'https://agent.meaku.ai/org/hackerearth/agent/1/?config=multimedia&showGlass=true?is_test=true&test_type=automated',
  );

  // 3. Interact with the chat flow
  // Suggestion: Add data-testid="start-demo-btn" to your button
  expect(page.getByTestId('greeting-banner')).toBeVisible();
  await page.getByTestId('greeting-banner').getByRole('button').click();

  //Click on first sugggested question
  const firstSuggestion = page.getByTestId('suggestion-item').nth(0);
  await firstSuggestion.click();

  // Add assertion to verify the slide container
  await expect(page.getByTestId('slide-container')).toBeVisible();

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

  // Verify suggestion items
  const suggestionItems = page.getByTestId('suggestion-item');
  const suggestedQuestion = suggestionItems.nth(0);
  await expect(suggestedQuestion).toBeVisible();
});
