import { Skeleton } from '@breakout/design-system/components/shadcn-ui/skeleton';
import { cn } from '@breakout/design-system/lib/cn';

type FilterOptionsShimmerProps = {
  numberOfOptions?: number;
  checkboxOrientation?: 'right' | 'left';
  isSearchInputShimmer?: boolean;
  isSelectAllShimmer?: boolean;
  isFlagShimmer?: boolean;
};
const FilterOptionsShimmer = ({
  numberOfOptions = 4,
  checkboxOrientation = 'left',
  isSearchInputShimmer = true,
  isSelectAllShimmer = true,
  isFlagShimmer = false,
}: FilterOptionsShimmerProps) => {
  return (
    <div className="px-4">
      {/* Search Input Shimmer */}
      {isSearchInputShimmer && (
        <div className="mb-4">
          <Skeleton className="h-12 w-full rounded-lg" />
        </div>
      )}

      {/* Select All Container Shimmer */}
      {isSelectAllShimmer && (
        <div className="mb-2 flex items-center justify-between border-b border-gray-200 px-2 pb-2">
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-8 w-24" />
          </div>
          <Skeleton className="h-6 w-14" />
        </div>
      )}

      {/* Checkbox Options Shimmer */}
      <div className="hide-scrollbar max-h-56 space-y-2 overflow-auto">
        {/* Render shimmer items */}
        {Array.from({ length: numberOfOptions }).map((_, index) => (
          <div
            key={index}
            className={cn('flex items-center gap-3 px-2 py-1', {
              'justify-between': isSearchInputShimmer,
            })}
          >
            {checkboxOrientation === 'left' && <Skeleton className="h-8 w-8" />}
            <div className="flex w-full items-center gap-2">
              {isFlagShimmer && <Skeleton className="h-8 w-8" />}
              <Skeleton className="h-8 w-full max-w-[100px]" />
            </div>
            {checkboxOrientation === 'right' && <Skeleton className="h-8 w-8" />}
          </div>
        ))}
      </div>

      {/* Footer Button Shimmer */}
      <div className="mt-4 py-4">
        <Skeleton className="h-10 w-28 rounded-lg" />
      </div>
    </div>
  );
};

export default FilterOptionsShimmer;
