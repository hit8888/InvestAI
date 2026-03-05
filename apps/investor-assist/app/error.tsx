"use client";

import { useEffect, useState } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [copied, setCopied] = useState(false);

  const errorLog = `Error: ${error.message}\nDigest: ${error.digest ?? "N/A"}\nStack: ${error.stack ?? "N/A"}`;

  useEffect(() => {
    console.error(error);
  }, [error]);

  function copyLog() {
    navigator.clipboard.writeText(errorLog).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
      <div className="max-w-lg w-full bg-white rounded-2xl border border-red-100 shadow-lg p-8 space-y-5">
        <div className="space-y-1">
          <h1 className="text-lg font-semibold text-gray-900">
            Something went wrong
          </h1>
          <p className="text-sm text-gray-500">
            An unexpected error occurred. Please copy the log below and send it
            to{" "}
            <a
              href="mailto:hitesh.aggarwal@gmail.com"
              className="text-brand-600 underline"
            >
              hitesh.aggarwal@gmail.com
            </a>{" "}
            so we can fix it.
          </p>
        </div>

        <div className="rounded-lg bg-gray-50 border border-gray-200 p-3 text-xs text-gray-600 font-mono whitespace-pre-wrap break-all max-h-48 overflow-y-auto">
          {errorLog}
        </div>

        <div className="flex gap-3">
          <button
            onClick={copyLog}
            className="flex-1 px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            {copied ? "Copied!" : "Copy log"}
          </button>
          <button
            onClick={reset}
            className="flex-1 px-4 py-2 rounded-lg bg-brand-600 text-white text-sm font-medium hover:bg-brand-700 transition-colors"
          >
            Try again
          </button>
        </div>
      </div>
    </div>
  );
}
