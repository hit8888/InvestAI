import { describe, it, expect, vi } from "vitest";

// Supabase uses implicit flow: tokens arrive in the URL hash (#access_token=...).
// Hash fragments are never sent to the server, so the callback MUST be a
// client-side page — NOT a route handler.
// These tests document the signInWithGoogle redirectTo constraint.

vi.mock("../lib/supabase", () => ({
  default: {
    auth: {
      signInWithOAuth: vi.fn().mockResolvedValue({}),
    },
  },
}));

import supabase from "../lib/supabase";
import { signInWithGoogle } from "../lib/supabase-auth";

describe("signInWithGoogle", () => {
  it("passes redirectTo pointing to /auth/callback with no extra query params", async () => {
    vi.stubGlobal("window", { location: { origin: "https://example.com" } });

    await signInWithGoogle();

    const call = vi.mocked(supabase.auth.signInWithOAuth).mock.calls[0][0];
    expect(call.provider).toBe("google");

    const redirectTo = call.options?.redirectTo as string;
    expect(redirectTo).toBeDefined();

    const url = new URL(redirectTo);
    // Must point exactly to /auth/callback — no query params
    // (Supabase URL matching is exact; query params break it)
    expect(url.pathname).toBe("/auth/callback");
    expect(url.search).toBe("");
  });

  it("includes the current origin in redirectTo", async () => {
    vi.stubGlobal("window", {
      location: { origin: "https://invest-ai-agent-admin.vercel.app" },
    });

    vi.mocked(supabase.auth.signInWithOAuth).mockClear();
    await signInWithGoogle();

    const call = vi.mocked(supabase.auth.signInWithOAuth).mock.calls[0][0];
    const redirectTo = call.options?.redirectTo as string;
    expect(redirectTo).toBe(
      "https://invest-ai-agent-admin.vercel.app/auth/callback",
    );
  });
});
