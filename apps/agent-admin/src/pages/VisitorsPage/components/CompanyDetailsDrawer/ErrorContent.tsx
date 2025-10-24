import { AlertCircle } from 'lucide-react';

interface ErrorContentProps {
  onClose: () => void;
  prospectId: string;
}

/**
 * Error state component for drawer when API fails
 */
const ErrorContent = ({ onClose, prospectId }: ErrorContentProps) => (
  <div className="flex h-full w-full flex-col items-center justify-center bg-white p-8">
    <AlertCircle className="mb-4 h-16 w-16 text-red-500" />
    <h2 className="mb-2 text-xl font-semibold text-gray-900">Failed to Load Details</h2>
    <p className="mb-6 text-center text-gray-600">
      We couldn't load the details for Row ID: <span className="font-mono text-sm">{prospectId}</span>
    </p>
    <p className="mb-6 text-center text-sm text-gray-500">
      This could be due to a network error or the prospect data may no longer be available.
    </p>
    <button
      onClick={onClose}
      className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
    >
      Close
    </button>
  </div>
);

export default ErrorContent;
