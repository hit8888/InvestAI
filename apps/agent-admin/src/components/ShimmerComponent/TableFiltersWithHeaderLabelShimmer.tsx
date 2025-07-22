import { Skeleton } from '@breakout/design-system/components/shadcn-ui/skeleton';

const TableFiltersWithHeaderLabelShimmer = () => {
  return (
    <div className="flex w-full items-start justify-between self-stretch bg-white py-4">
      <div className="flex items-center gap-4">
        <Skeleton className="h-10 w-24" />
      </div>
      <div className="flex items-center gap-4">
        <Skeleton className="h-10 w-60" />
        <Skeleton className="h-10 w-10" />
      </div>
    </div>
  );
};

export default TableFiltersWithHeaderLabelShimmer;
