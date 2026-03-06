import supabase from "./supabase";
import type { AuthUser } from "@/components/auth/AuthProvider";
import type { Session } from "@supabase/supabase-js";

function toAuthUser(session: Session | null): AuthUser | null {
  if (!session?.user) return null;
  const { id, email, user_metadata } = session.user;
  return {
    uid: id,
    email: email ?? null,
    displayName:
      (user_metadata?.full_name as string | undefined) ??
      (user_metadata?.name as string | undefined) ??
      null,
    photoURL: (user_metadata?.avatar_url as string | undefined) ?? null,
  };
}

export async function signInWithGoogle(): Promise<void> {
  await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo:
        typeof window !== "undefined"
          ? `${window.location.origin}/auth/callback?next=/dashboard`
          : undefined,
    },
  });
}

export async function signOutUser(): Promise<void> {
  await supabase.auth.signOut();
}

export function onAuthChange(
  callback: (user: AuthUser | null) => void,
): () => void {
  // Fire immediately with current session
  supabase.auth.getSession().then(({ data }) => {
    callback(toAuthUser(data.session));
  });

  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(toAuthUser(session));
  });

  return () => subscription.unsubscribe();
}
