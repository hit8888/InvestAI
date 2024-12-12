// getTenantFromUrl.test.ts
import { getTenantFromUrl } from "./getTenantFromUrl";

describe("getTenantFromUrl", () => {
  const originalWindow = window;

  beforeEach(() => {
    Object.defineProperty(globalThis, "window", {
      value: {
        location: {
          pathname: "",
        },
      },
      writable: true,
    });
  });

  afterEach(() => {
    Object.defineProperty(globalThis, "window", {
      value: originalWindow,
      writable: true,
    });
  });

  it("extracts tenant name when org is present in URL", () => {
    Object.defineProperty(window, "location", {
      value: { pathname: "/org/tenant123/dashboard" },
      writable: true,
    });
    expect(getTenantFromUrl()).toBe("tenant123");
  });

  it("returns empty string when org is not in URL", () => {
    Object.defineProperty(window, "location", {
      value: { pathname: "/dashboard/settings" },
      writable: true,
    });
    expect(getTenantFromUrl()).toBe("");
  });

  it("handles multiple org occurrences in URL", () => {
    Object.defineProperty(window, "location", {
      value: { pathname: "/org/tenant123/org/nested" },
      writable: true,
    });
    expect(getTenantFromUrl()).toBe("tenant123");
  });

  it("handles trailing slashes", () => {
    Object.defineProperty(window, "location", {
      value: { pathname: "/org/tenant123/" },
      writable: true,
    });
    expect(getTenantFromUrl()).toBe("tenant123");
  });
});
