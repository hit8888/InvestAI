import { AlertTriangle } from 'lucide-react';

interface ConfigErrorScreenProps {
  error: string;
}

/**
 * Full-screen error state for configuration validation failures
 * Shows detailed error message for developers
 */
export const ConfigErrorScreen = ({ error }: ConfigErrorScreenProps) => {
  return (
    <div className="flex h-full w-full items-center justify-center bg-red-50">
      <div className="max-w-2xl rounded-lg bg-white p-8 shadow-lg">
        <div className="mb-4 flex items-center gap-3">
          <AlertTriangle className="h-8 w-8 text-red-600" />
          <h2 className="text-2xl font-bold text-red-900">Configuration Error</h2>
        </div>

        <p className="mb-4 text-gray-700">
          There is an error in the table configuration. Please contact the development team or check the browser console
          for details.
        </p>

        <div className="mb-6 rounded border border-red-300 bg-red-100 p-4 font-mono text-sm">{error}</div>

        <button
          onClick={() => window.location.reload()}
          className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
        >
          Reload Page
        </button>
      </div>
    </div>
  );
};
