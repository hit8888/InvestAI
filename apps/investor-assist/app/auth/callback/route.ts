import { NextRequest, NextResponse } from "next/server";

// Pass the OAuth code through to the dashboard page.
// The browser Supabase client handles the PKCE code exchange
// automatically via detectSessionInUrl (on by default).
export async function GET(req: NextRequest) {
  const { searchParams, origin } = new URL(req.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (!code) {
    return NextResponse.redirect(`${origin}/?error=auth_failed`);
  }

  return NextResponse.redirect(`${origin}${next}?code=${code}`);
}
