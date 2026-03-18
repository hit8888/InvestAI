"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, Loader2, Mail } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import {
  getAlertPreferences,
  upsertAlertPreferences,
  type AlertPreferences,
} from "@/lib/supabase-db";

const DEFAULT_PREFS: AlertPreferences = {
  dailyAlertEnabled: false,
  eventAlertEnabled: false,
};

export default function SettingsClient() {
  const { user, loading, signIn } = useAuth();
  const searchParams = useSearchParams();
  const fromUnsub = searchParams.get("unsubscribe") === "1";

  const [prefs, setPrefs] = useState<AlertPreferences>(DEFAULT_PREFS);
  const [initialLoading, setInitialLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!user) return;
      setInitialLoading(true);
      try {
        const p = await getAlertPreferences(user.uid);
        if (cancelled) return;
        setPrefs(p ?? DEFAULT_PREFS);
      } finally {
        if (!cancelled) setInitialLoading(false);
      }
    }
    load().catch(() => {
      // non-fatal
    });
    return () => {
      cancelled = true;
    };
  }, [user]);

  const emailNotificationsEnabled = useMemo(
    () => prefs.dailyAlertEnabled || prefs.eventAlertEnabled,
    [prefs.dailyAlertEnabled, prefs.eventAlertEnabled],
  );

  async function save(next: AlertPreferences) {
    if (!user) return;
    setSaving(true);
    setSaved(false);
    try {
      await upsertAlertPreferences(user.uid, next);
      setPrefs(next);
      setSaved(true);
      window.setTimeout(() => setSaved(false), 2500);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-8">
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>
      </div>

      <div className="rounded-2xl bg-white/80 backdrop-blur-sm border border-white shadow-xl shadow-gray-200/60 p-6">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-xl bg-brand-600 text-white flex items-center justify-center">
            <Mail className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <h1 className="text-xl font-semibold text-gray-900">Settings</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Manage your email notifications for portfolio alerts and briefings.
            </p>
          </div>
        </div>

        {fromUnsub && (
          <div className="mt-5 rounded-xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            You opened this from an unsubscribe link. Turn off email notifications
            below to stop future emails.
          </div>
        )}

        {!loading && !user ? (
          <div className="mt-6 rounded-xl border border-brand-100 bg-brand-50 p-5 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-brand-900">
                Sign in to manage notifications
              </p>
              <p className="text-xs text-brand-600 mt-0.5">
                After signing in, you can disable email alerts with one click.
              </p>
            </div>
            <button
              type="button"
              onClick={signIn}
              className="px-4 py-2 rounded-xl bg-brand-600 text-white text-sm font-medium hover:bg-brand-700 transition-colors shrink-0"
            >
              Sign in with Google
            </button>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            <label className="flex items-center justify-between gap-3 rounded-2xl border border-gray-100 bg-white p-4 hover:bg-gray-50 transition-colors">
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  Email notifications
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Uncheck to stop all InvestAI emails.
                </p>
              </div>
              <input
                type="checkbox"
                checked={emailNotificationsEnabled}
                onChange={(e) => {
                  const enabled = e.target.checked;
                  const next: AlertPreferences = enabled
                    ? {
                        ...prefs,
                        // default: enable daily if they turn it on here
                        dailyAlertEnabled:
                          prefs.dailyAlertEnabled || prefs.eventAlertEnabled
                            ? prefs.dailyAlertEnabled
                            : true,
                      }
                    : { dailyAlertEnabled: false, eventAlertEnabled: false };
                  void save(next);
                }}
                disabled={saving || initialLoading}
                className="h-4 w-4 accent-brand-600"
              />
            </label>

            <div className="rounded-2xl border border-gray-100 bg-white p-4">
              <p className="text-sm font-semibold text-gray-900">
                Notification types
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                Optional: fine-tune which emails you receive.
              </p>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="flex items-center justify-between gap-3 rounded-xl border border-gray-100 p-3 hover:bg-gray-50 transition-colors">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Daily briefing
                    </p>
                    <p className="text-xs text-gray-500">
                      Pre-market summary for your holdings
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={prefs.dailyAlertEnabled}
                    onChange={(e) =>
                      void save({
                        ...prefs,
                        dailyAlertEnabled: e.target.checked,
                      })
                    }
                    disabled={saving || initialLoading}
                    className="h-4 w-4 accent-brand-600"
                  />
                </label>

                <label className="flex items-center justify-between gap-3 rounded-xl border border-gray-100 p-3 hover:bg-gray-50 transition-colors">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Event alerts
                    </p>
                    <p className="text-xs text-gray-500">
                      When major events impact holdings
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={prefs.eventAlertEnabled}
                    onChange={(e) =>
                      void save({
                        ...prefs,
                        eventAlertEnabled: e.target.checked,
                      })
                    }
                    disabled={saving || initialLoading}
                    className="h-4 w-4 accent-brand-600"
                  />
                </label>
              </div>

              <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center gap-2">
                  {initialLoading && (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      Loading…
                    </>
                  )}
                  {saving && (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      Saving…
                    </>
                  )}
                  {!saving && !initialLoading && saved && (
                    <span className="text-brand-700 font-medium">Saved</span>
                  )}
                </div>
                <span>Changes apply immediately.</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

