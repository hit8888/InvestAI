import { Skeleton } from '@breakout/design-system/components/shadcn-ui/skeleton';

const TablePaginationShimmer = () => {
  return (
    <div className="flex w-full items-center justify-end gap-4">
      <div className="flex items-start gap-2">
        <Skeleton className="h-9 w-24" />
        <Skeleton className="h-9 w-24 bg-white" />
      </div>
      <div className="flex items-center gap-2">
        <Skeleton className="h-9 w-9" />
        <Skeleton className="h-9 w-9" />
      </div>
    </div>
  );
};

export default TablePaginationShimmer;
