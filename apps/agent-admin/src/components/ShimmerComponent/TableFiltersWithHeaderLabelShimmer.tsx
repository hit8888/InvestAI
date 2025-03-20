import { Skeleton } from '@breakout/design-system/components/shadcn-ui/skeleton';

const TableFiltersWithHeaderLabelShimmer = () => {
  return (
    <div className="flex w-full items-start justify-between self-stretch bg-white py-4">
      <div className="flex items-center gap-4">
        <Skeleton className="h-10 w-10" />
        <Skeleton className="h-10 w-24" />
      </div>
      <Skeleton className="h-10 w-16" />
    </div>
  );
};

export default TableFiltersWithHeaderLabelShimmer;
