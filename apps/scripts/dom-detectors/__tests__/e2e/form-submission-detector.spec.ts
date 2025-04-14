import { test, expect } from "@playwright/test";
import { startServer, waitForRequest } from "./utils";
import { createProspectRegexStr } from "./constants";

test.describe("Form submission detection", () => {
  let server;
  let port;

  test.beforeAll(async () => {
    server = await startServer();
    port = server.address().port;
  });

  test.afterAll(() => {
    server.close();
  });

  test("detects form submission with unnamed form fields", async ({ page }) => {
    const requestPromise = waitForRequest(page, createProspectRegexStr);

    await page.goto(
      `http://localhost:${port}/simple-form-with-unnamed-fields.html`,
    );

    // fill up the form
    await page.getByPlaceholder("Enter name").fill("Sam");
    await page.getByTestId("country").selectOption("USA");
    await page.getByPlaceholder("Enter email").fill("sam@new.com");
    await page.getByPlaceholder("Enter password").fill("pa$$wôrd");
    await page.getByPlaceholder("About you").fill("something about you");
    await page.locator("button").click();

    const request = await requestPromise;
    const requestData = JSON.parse(request.postData() ?? "{}");
    const {
      prospect_demographics: { formMeta, formData },
      email,
      origin,
    } = requestData;

    expect(email).toEqual("sam@new.com");
    expect(origin).toEqual("WEB_FORM");

    expect(formMeta.id).toBe("form-with-unnamed-fields");
    expect(formData["unnamed_element_input_text_0"].value).toBe("Sam");
    expect(formData["unnamed_element_select_select-one_1"].value).toBe("USA");
    expect(formData["unnamed_element_input_email_2"].value).toBe("sam@new.com");
    expect(formData["unnamed_element_input_password_3"].value).toBe("*****");
    expect(formData["unnamed_element_textarea_textarea_4"].value).toBe(
      "something about you",
    );
    expect(formData["unnamed_element_input_file_5"]).toBeUndefined(); // file uploads are not tracked
  });

  test("detects form submission with named form fields", async ({ page }) => {
    const requestPromise = waitForRequest(page, createProspectRegexStr);

    await page.goto(
      `http://localhost:${port}/simple-form-with-named-fields.html`,
    );

    // fill up the form
    await page.getByPlaceholder("Enter name").fill("Sam");
    await page.locator("#country").selectOption("USA");
    await page.getByPlaceholder("Enter email").fill("sam@new.com");
    await page.getByPlaceholder("Enter password").fill("pa$$wôrd");
    await page.getByPlaceholder("About you").fill("something about you");
    await page.locator("button").click();

    const request = await requestPromise;
    const requestData = JSON.parse(request.postData() ?? "{}");
    const {
      prospect_demographics: { formMeta, formData },
      email,
      name,
      origin,
    } = requestData;

    expect(email).toEqual("sam@new.com");
    expect(name).toEqual("Sam");
    expect(origin).toEqual("WEB_FORM");

    expect(formMeta.id).toBe("form-with-named-fields");
    expect(formData["name"].value).toBe("Sam");
    expect(formData["country"].value).toBe("USA");
    expect(formData["email"].value).toBe("sam@new.com");
    expect(formData["password"].value).toBe("*****");
    expect(formData["about-you"].value).toBe("something about you");
    expect(formData["photo"]).toBeUndefined(); // file uploads are not tracked
  });

  test("detects form submission for forms without submit button", async ({
    page,
  }) => {
    const requestPromise = waitForRequest(page, createProspectRegexStr);

    await page.goto(
      `http://localhost:${port}/simple-form-without-submit-button.html`,
    );

    // fill up the form
    await page.getByPlaceholder("Enter name").fill("Sam");
    await page.getByPlaceholder("Enter email").fill("sam@new.com");
    await page.locator("button").click();

    const request = await requestPromise;
    const requestData = JSON.parse(request.postData() ?? "{}");
    const {
      prospect_demographics: { formMeta, formData },
      email,
      name,
      origin,
    } = requestData;

    expect(email).toEqual("sam@new.com");
    expect(name).toEqual("Sam");
    expect(origin).toEqual("WEB_FORM");

    expect(formMeta.id).toBe("form-without-submit-button");
    expect(formData["name"].value).toBe("Sam");
    expect(formData["email"].value).toBe("sam@new.com");
  });

  test("detect form submission for dynamically added form fields", async ({
    page,
  }) => {
    const requestPromise = waitForRequest(page, createProspectRegexStr);

    await page.goto(`http://localhost:${port}/dynamically-added-form.html`);

    await page.waitForTimeout(500); // wait for the form to be added

    // fill up the form
    await page.getByPlaceholder("Enter name").fill("Sam");
    await page.locator("button").click();

    const request = await requestPromise;
    const requestData = JSON.parse(request.postData() ?? "{}");
    const {
      prospect_demographics: { formMeta, formData },
    } = requestData;

    expect(formMeta.id).toBe("dynamically-added-form");
    expect(formData["name"].value).toBe("Sam");
  });

  test("no submission if failing form validation", async ({ page }) => {
    const requestPromise = waitForRequest(page, createProspectRegexStr);

    await page.goto(
      `http://localhost:${port}/simple-form-with-submit-canceled.html`,
    );

    // fill up the form
    await page.getByPlaceholder("Enter name").fill("Sam");
    await page.getByPlaceholder("Enter email").fill("sam@new.com");
    await page.locator("button").click();

    await expect(requestPromise).rejects.toThrow(
      'Request with URL containing "/tenant/chat/prospect/create" not found within 20000ms',
    );
  });

  test("does not detect if form submission tracking is turned off", async ({
    page,
  }) => {
    const requestPromise = waitForRequest(page, createProspectRegexStr);

    await page.goto(`http://localhost:${port}/tracking-turned-off.html`);
    await page.locator("button").click();

    await expect(requestPromise).rejects.toThrow(
      'Request with URL containing "/tenant/chat/prospect/create" not found within 20000ms',
    );
  });
});
