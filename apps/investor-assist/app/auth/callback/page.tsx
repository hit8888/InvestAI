"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import supabase from "@/lib/supabase";

// Supabase implicit flow returns tokens in the URL hash (#access_token=...).
// Hash fragments are never sent to the server, so this MUST be a client
// component — the browser Supabase client reads the hash and sets the session.
export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        subscription.unsubscribe();
        router.replace("/dashboard");
      } else if (event === "SIGNED_OUT") {
        subscription.unsubscribe();
        router.replace("/?error=auth_failed");
      }
    });

    // Also check for an existing session in case the event already fired
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        subscription.unsubscribe();
        router.replace("/dashboard");
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-3">
      <Loader2 className="h-6 w-6 animate-spin text-brand-500" />
      <p className="text-sm text-gray-500">Signing you in…</p>
    </div>
  );
}
