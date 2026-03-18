"use client";

import { useEffect, useMemo, useState } from "react";
import { Bell, Mail, X } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { useAnalysisStore } from "@/stores/analysisStore";
import {
  getAlertPreferences,
  upsertAlertPreferences,
  type AlertPreferences,
} from "@/lib/supabase-db";

const DISMISS_UNAUTH_ALERTS_KEY = "investai:dismiss:unauth_alerts:v1";
const DISMISS_DAILY_PROMPT_KEY = "investai:dismiss:daily_prompt:v1";

function readDismissed(key: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(key) === "1";
  } catch {
    return false;
  }
}

function writeDismissed(key: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, "1");
  } catch {
    // ignore
  }
}

export function EngagementPrompts() {
  const { user, loading, signIn } = useAuth();
  const { step, portfolio, result } = useAnalysisStore();

  // ---------- Unauthenticated prompt ----------
  const shouldShowUnauthPrompt = useMemo(() => {
    if (loading || user) return false;
    const hasWorkDone = portfolio.length > 0 || step === "results" || !!result;
    if (!hasWorkDone) return false;
    return !readDismissed(DISMISS_UNAUTH_ALERTS_KEY);
  }, [loading, user, portfolio.length, step, result]);

  const [unauthVisible, setUnauthVisible] = useState(false);
  useEffect(() => {
    if (shouldShowUnauthPrompt) setUnauthVisible(true);
  }, [shouldShowUnauthPrompt]);

  // ---------- Authenticated preferences prompt ----------
  const [prefs, setPrefs] = useState<AlertPreferences | null>(null);
  const [prefsDraft, setPrefsDraft] = useState<AlertPreferences>({
    dailyAlertEnabled: false,
    eventAlertEnabled: false,
  });
  const [prefsLoading, setPrefsLoading] = useState(false);
  const [prefsSaving, setPrefsSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function loadPrefs() {
      if (!user) {
        setPrefs(null);
        return;
      }
      setPrefsLoading(true);
      try {
        const p = await getAlertPreferences(user.uid);
        if (cancelled) return;
        setPrefs(p);
        if (p) setPrefsDraft(p);
      } finally {
        if (!cancelled) setPrefsLoading(false);
      }
    }
    loadPrefs().catch(() => {
      // non-fatal
    });
    return () => {
      cancelled = true;
    };
  }, [user]);

  const shouldShowDailyPrompt = useMemo(() => {
    if (loading || !user) return false;
    if (portfolio.length === 0) return false;
    if (readDismissed(DISMISS_DAILY_PROMPT_KEY)) return false;
    // If they already enabled something, don't bug them.
    if (prefs?.dailyAlertEnabled || prefs?.eventAlertEnabled) return false;
    // Show after user has meaningfully engaged (results or moved past portfolio)
    const engaged = step !== "portfolio";
    return engaged;
  }, [loading, user, portfolio.length, prefs, step]);

  const [dailyVisible, setDailyVisible] = useState(false);
  useEffect(() => {
    if (shouldShowDailyPrompt) setDailyVisible(true);
  }, [shouldShowDailyPrompt]);

  return (
    <div className="space-y-3 mb-6">
      {unauthVisible && (
        <div className="rounded-2xl border border-brand-100 bg-gradient-to-br from-brand-50 to-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <div className="h-9 w-9 rounded-xl bg-brand-600 text-white flex items-center justify-center shadow-sm">
                  <Mail className="h-4 w-4" />
                </div>
                <p className="text-sm font-semibold text-gray-900">
                  Stay ahead of the market
                </p>
              </div>
              <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                I can send you real-time email alerts when global, political, or
                economic events are predicted to move your specific portfolio.
                <span className="text-gray-900 font-medium">
                  {" "}
                  Sign in to activate your alerts.
                </span>
              </p>
            </div>

            <button
              onClick={() => {
                writeDismissed(DISMISS_UNAUTH_ALERTS_KEY);
                setUnauthVisible(false);
              }}
              className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors"
              aria-label="Dismiss"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-4 flex items-center justify-between gap-3">
            <div className="text-xs text-gray-500">
              Your portfolio will be saved after you sign in.
            </div>
            <button
              onClick={signIn}
              disabled={loading}
              className="px-4 py-2 rounded-xl bg-brand-600 text-white text-sm font-medium hover:bg-brand-700 disabled:opacity-50 transition-colors"
            >
              Sign in with Google
            </button>
          </div>
        </div>
      )}

      {dailyVisible && (
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <div className="h-9 w-9 rounded-xl bg-gray-900 text-white flex items-center justify-center">
                  <Bell className="h-4 w-4" />
                </div>
                <p className="text-sm font-semibold text-gray-900">
                  Daily Pre-Market Briefing
                </p>
              </div>
              <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                Every morning before the bell, I&apos;ll email you an AI-summary
                of how overnight news affects your specific holdings.
              </p>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="flex items-center justify-between gap-3 rounded-xl border border-gray-100 p-3 hover:bg-gray-50 transition-colors">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Daily briefing
                    </p>
                    <p className="text-xs text-gray-500">
                      One email each weekday morning
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={prefsDraft.dailyAlertEnabled}
                    onChange={(e) =>
                      setPrefsDraft((p) => ({
                        ...p,
                        dailyAlertEnabled: e.target.checked,
                      }))
                    }
                    className="h-4 w-4 accent-brand-600"
                  />
                </label>

                <label className="flex items-center justify-between gap-3 rounded-xl border border-gray-100 p-3 hover:bg-gray-50 transition-colors">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Event alerts
                    </p>
                    <p className="text-xs text-gray-500">
                      When a major event impacts holdings
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={prefsDraft.eventAlertEnabled}
                    onChange={(e) =>
                      setPrefsDraft((p) => ({
                        ...p,
                        eventAlertEnabled: e.target.checked,
                      }))
                    }
                    className="h-4 w-4 accent-brand-600"
                  />
                </label>
              </div>
            </div>

            <button
              onClick={() => {
                writeDismissed(DISMISS_DAILY_PROMPT_KEY);
                setDailyVisible(false);
              }}
              className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors"
              aria-label="Dismiss"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-4 flex items-center justify-between gap-3">
            <div className="text-xs text-gray-500">
              {prefsLoading
                ? "Loading your preferences…"
                : "You can change this anytime."}
            </div>

            <button
              onClick={async () => {
                if (!user) return;
                setPrefsSaving(true);
                try {
                  await upsertAlertPreferences(user.uid, prefsDraft);
                  setPrefs(prefsDraft);
                  writeDismissed(DISMISS_DAILY_PROMPT_KEY);
                  setDailyVisible(false);
                } finally {
                  setPrefsSaving(false);
                }
              }}
              disabled={prefsSaving || prefsLoading}
              className="px-4 py-2 rounded-xl bg-gray-900 text-white text-sm font-medium hover:bg-black disabled:opacity-50 transition-colors"
            >
              {prefsSaving ? "Saving…" : "Enable"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

