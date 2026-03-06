import { describe, it, expect, vi, beforeEach } from "vitest";

// ─── /auth/callback route handler ────────────────────────────────────────────

// We test the route handler logic directly by importing it.
// NextRequest / NextResponse need to be available — use undici or a minimal mock.

vi.mock("next/server", () => ({
  NextRequest: class {
    url: string;
    constructor(url: string) {
      this.url = url;
    }
  },
  NextResponse: {
    redirect: vi.fn((url: string) => ({ redirectUrl: url })),
  },
}));

import { GET } from "../app/auth/callback/route";
import { NextRequest, NextResponse } from "next/server";

beforeEach(() => {
  vi.mocked(NextResponse.redirect).mockClear();
});

describe("/auth/callback route", () => {
  it("redirects to /dashboard?code=... when code is present", async () => {
    const req = new NextRequest(
      "https://invest-ai-agent-admin.vercel.app/auth/callback?code=abc123",
    );
    await GET(req as never);

    expect(NextResponse.redirect).toHaveBeenCalledWith(
      "https://invest-ai-agent-admin.vercel.app/dashboard?code=abc123",
    );
  });

  it("redirects to /?error=auth_failed when code is missing", async () => {
    const req = new NextRequest(
      "https://invest-ai-agent-admin.vercel.app/auth/callback",
    );
    await GET(req as never);

    expect(NextResponse.redirect).toHaveBeenCalledWith(
      "https://invest-ai-agent-admin.vercel.app/?error=auth_failed",
    );
  });

  it("does NOT include query params in the base redirectTo path (Supabase exact match)", async () => {
    // This test documents the constraint: the redirect URL registered in Supabase
    // must match exactly. Query params appended to redirectTo break URL matching.
    // The callback route should only redirect to /dashboard, never to /dashboard?next=...
    const req = new NextRequest(
      "https://invest-ai-agent-admin.vercel.app/auth/callback?code=xyz",
    );
    await GET(req as never);

    const redirectTarget = vi.mocked(NextResponse.redirect).mock
      .calls[0][0] as string;
    const url = new URL(redirectTarget);

    // Destination must be /dashboard — no extra path segments
    expect(url.pathname).toBe("/dashboard");
    // code param must be forwarded for browser Supabase client to exchange
    expect(url.searchParams.get("code")).toBe("xyz");
  });
});

// ─── signInWithGoogle redirectTo format ──────────────────────────────────────

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
    // Simulate browser environment
    vi.stubGlobal("window", { location: { origin: "https://example.com" } });

    await signInWithGoogle();

    const call = vi.mocked(supabase.auth.signInWithOAuth).mock.calls[0][0];
    expect(call.provider).toBe("google");

    const redirectTo = call.options?.redirectTo as string;
    expect(redirectTo).toBeDefined();

    const url = new URL(redirectTo);
    // Must end at /auth/callback — no query params (Supabase exact URL matching)
    expect(url.pathname).toBe("/auth/callback");
    expect(url.search).toBe("");
  });
});
