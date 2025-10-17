/**
 * Loading skeleton for table
 * Shows shimmer effect for rows
 */
export const TableLoadingSkeleton = ({ rows = 10 }: { rows?: number }) => {
  return (
    <div className="w-full animate-pulse">
      {/* Header skeleton */}
      <div className="mb-4 flex gap-4">
        <div className="h-10 w-1/4 rounded bg-gray-200"></div>
        <div className="h-10 w-1/4 rounded bg-gray-200"></div>
        <div className="h-10 w-1/4 rounded bg-gray-200"></div>
        <div className="h-10 w-1/4 rounded bg-gray-200"></div>
      </div>

      {/* Row skeletons */}
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="mb-2 flex gap-4">
          <div className="h-12 w-1/4 rounded bg-gray-100"></div>
          <div className="h-12 w-1/4 rounded bg-gray-100"></div>
          <div className="h-12 w-1/4 rounded bg-gray-100"></div>
          <div className="h-12 w-1/4 rounded bg-gray-100"></div>
        </div>
      ))}
    </div>
  );
};
