import { Skeleton } from '@breakout/design-system/components/shadcn-ui/skeleton';

const LogTabDisplayContentShimmer = () => {
  return (
    <div className="flex w-full flex-col pr-4 pt-10">
      {/* User Message */}
      <div className="mb-6 flex flex-col items-end gap-2">
        <Skeleton className="h-6 w-20 bg-primary/40" />
        <div className="max-w-md rounded-lg bg-primary/20 p-4 text-white">
          <Skeleton className="h-8 w-64 bg-primary/40" />
          <div className="mt-2 text-right text-xs">
            <Skeleton className="ml-auto h-6 w-24 bg-primary/30" />
          </div>
        </div>
      </div>

      {/* Bot Response */}
      <div className="mb-6 flex">
        <div className="mr-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20">
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        </div>
        <div className="flex-1">
          <div className="mb-3">
            <Skeleton className="mb-2 h-5 w-full max-w-xl" />
            <div className="ml-6">
              <ul className="mt-3 list-disc space-y-3">
                {[1, 2, 3, 4, 5].map((item) => (
                  <li key={item} className="flex items-start">
                    <div className="mr-2 mt-2 h-2 w-2 rounded-full bg-gray-300"></div>
                    <Skeleton className="h-4 w-full" />
                  </li>
                ))}
              </ul>
            </div>
            <Skeleton className="mt-2 h-5 w-3/4" />
          </div>
          <Skeleton className="mt-6 h-10 w-full" />

          {/* Timestamp */}
          <div className="mt-3 text-xs text-gray-500">
            <Skeleton className="h-6 w-36" />
          </div>

          {/* Feedback Buttons */}
          <div className="mt-3 flex items-center gap-2">
            <Skeleton className="h-8 w-8 rounded" />
            <Skeleton className="h-8 w-8 rounded" />
          </div>

          {/* Analytics */}
          <div className="mt-3 flex items-center gap-4">
            <Skeleton className="h-6 w-32" />
            <div className="inline-block rounded bg-primary/10 px-2 py-2 text-xs text-primary">
              <Skeleton className="h-4 w-24" />
            </div>
          </div>

          {/* Video Card */}
          <div className="mt-4 max-w-xl rounded-lg bg-primary/10 p-4">
            <div className="flex items-start justify-between">
              <div className="mr-3 rounded-lg bg-primary/20 p-2">
                <div className="flex h-8 w-8 items-center justify-center">
                  <Skeleton className="h-8 w-8 rounded" />
                </div>
              </div>
              <div className="ml-2">
                <Skeleton className="h-10 w-10 rounded-full" />
              </div>
            </div>
            <div className="mt-4 flex-1">
              <Skeleton className="mb-2 h-8 w-48" />
              <Skeleton className="h-6 w-full" />
            </div>
          </div>

          {/* Quick Buttons */}
          <div className="mt-4 flex w-1/4 flex-col gap-2">
            {[1, 2, 3].map((btn) => (
              <div key={btn} className="flex items-center gap-2 rounded-full bg-primary/20 px-4 py-2">
                <Skeleton className="h-6 w-6" />
                <Skeleton className="h-6 w-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogTabDisplayContentShimmer;
