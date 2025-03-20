import { Skeleton } from '@breakout/design-system/components/shadcn-ui/skeleton';

const SummaryTabDisplayContentShimmer = () => {
  return (
    <div className="flex w-full flex-col items-start justify-center gap-4 py-4 pr-4">
      <Skeleton className="h-48 w-full rounded-3xl" />
      <Skeleton className="h-16 w-full rounded-3xl" />
      <Skeleton className="h-72 w-full rounded-3xl" />
      <Skeleton className="h-16 w-full rounded-3xl" />
      <Skeleton className="h-16 w-full rounded-3xl" />
      <Skeleton className="h-16 w-full rounded-3xl" />
      <Skeleton className="h-16 w-full rounded-3xl" />
    </div>
  );
};

export default SummaryTabDisplayContentShimmer;
