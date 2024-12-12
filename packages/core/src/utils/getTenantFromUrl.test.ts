// getTenantFromUrl.test.ts
import { getTenantFromUrl } from "./getTenantFromUrl";

describe("getTenantFromUrl", () => {
  const originalWindow = global.window;

  beforeEach(() => {
    // Mock window object
    delete global.window;
    global.window = { ...originalWindow };
  });

  afterEach(() => {
    global.window = originalWindow;
  });

  it("extracts tenant name when org is present in URL", () => {
    Object.defineProperty(window, "location", {
      value: { pathname: "/org/tenant123/dashboard" },
    });
    expect(getTenantFromUrl()).toBe("tenant123");
  });

  it("returns empty string when org is not in URL", () => {
    Object.defineProperty(window, "location", {
      value: { pathname: "/dashboard/settings" },
    });
    expect(getTenantFromUrl()).toBe("");
  });

  it("handles multiple org occurrences in URL", () => {
    Object.defineProperty(window, "location", {
      value: { pathname: "/org/tenant123/org/nested" },
    });
    expect(getTenantFromUrl()).toBe("tenant123");
  });

  it("handles trailing slashes", () => {
    Object.defineProperty(window, "location", {
      value: { pathname: "/org/tenant123/" },
    });
    expect(getTenantFromUrl()).toBe("tenant123");
  });
});
