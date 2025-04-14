import { test, expect } from "@playwright/test";
import { startServer, waitForRequest } from "./utils";
import { createProspectRegexStr, updateProspectRegexStr } from "./constants";

test.describe("Element click detection", () => {
  let server;
  let port: number;

  test.beforeAll(async () => {
    server = await startServer();
    port = server.address().port;
  });

  test.afterAll(() => {
    server.close();
  });

  test("detects when an element (by id) is clicked", async ({ page }) => {
    const requestPromise = waitForRequest(page, createProspectRegexStr);

    await page.goto(`http://localhost:${port}/tracking-element-click.html`);
    await page.getByText("Link with ID").click();

    const request = await requestPromise;
    const requestData = JSON.parse(request.postData() ?? "{}");
    const {
      prospect_demographics: { selector, params },
      origin,
    } = requestData;

    expect(selector).toEqual("#link1");
    expect(params.ref_src).toEqual("twsrc^google|twcamp^serp|twgr^author");
    expect(origin).toEqual("LINK_CLICK");
  });

  test("detects when an element (by class) is clicked", async ({ page }) => {
    const requestPromise = waitForRequest(page, createProspectRegexStr);

    await page.goto(`http://localhost:${port}/tracking-element-click.html`);
    await page.getByText("Link with class").click();

    const request = await requestPromise;
    const requestData = JSON.parse(request.postData() ?? "{}");
    const {
      prospect_demographics: { selector, params },
      origin,
    } = requestData;

    expect(selector).toEqual(".link-group");
    expect(params.utm_medium).toEqual("referral");
    expect(params.utm_source).toEqual("community");
    expect(params.utm_campaign).toEqual("side-bar");
    expect(origin).toEqual("LINK_CLICK");
  });

  test("detects click on dynamically added elements", async ({ page }) => {
    const requestPromise = waitForRequest(page, createProspectRegexStr);

    await page.goto(`http://localhost:${port}/dynamically-added-element.html`);
    await page.waitForTimeout(500); // wait for the elements to be added
    await page.getByText("Link with ID").click();

    const request = await requestPromise;
    const requestData = JSON.parse(request.postData() ?? "{}");
    const {
      prospect_demographics: { selector, params },
      origin,
    } = requestData;

    expect(selector).toEqual("#link-with-id");
    expect(params.utm_medium).toEqual("external-link");
    expect(params.utm_source).toEqual("group");
    expect(origin).toEqual("LINK_CLICK");
  });

  test("does not detect if click tracking is turned off", async ({ page }) => {
    const requestPromise = waitForRequest(page, createProspectRegexStr);

    await page.goto(`http://localhost:${port}/tracking-turned-off.html`);
    await page.getByText("Link with ID").click();

    await expect(requestPromise).rejects.toThrow(
      'Request with URL containing "/tenant/chat/prospect/create" not found within 20000ms',
    );
  });

  test("detects and makes update api call if prospectId is available", async ({
    page,
  }) => {
    const requestPromise = waitForRequest(page, updateProspectRegexStr);

    await page.goto(`http://localhost:${port}/tracking-element-click.html`);
    await page.evaluate(() => {
      // @ts-expect-error __breakout__ is custom defined on window
      window.__breakout__ = {
        prospectId: "some-prospect-uuid",
      };
    });
    await page.getByText("Link with ID").click();

    const request = await requestPromise;
    const requestData = JSON.parse(request.postData() ?? "{}");
    const {
      prospect_demographics: { selector },
      origin,
    } = requestData;

    expect(selector).toEqual("#link1");
    expect(origin).toEqual("LINK_CLICK");
  });
});
