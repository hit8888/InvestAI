import { Loader2 } from 'lucide-react';

/**
 * Loading overlay for table
 * Shows spinner over existing content during refetch
 */
export const TableLoadingOverlay = () => {
  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/70 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-gray-300" />
      </div>
    </div>
  );
};
