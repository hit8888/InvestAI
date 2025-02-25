import { Skeleton } from '@breakout/design-system/components/shadcn-ui/skeleton';

type IProps = {
  itemKey: string;
};

const SingleRightSideItemDataDisplayShimmer = ({ itemKey }: IProps) => {
  return (
    <div key={itemKey} className={'flex w-full items-start self-stretch px-2 py-4'}>
      <div className="flex w-full items-center justify-start gap-2">
        <Skeleton className="h-8 w-8 rounded-lg" /> {/* Icon placeholder */}
        <Skeleton className="h-6 w-24" /> {/* Label placeholder */}
      </div>
      <div className="flex w-full justify-end">
        <Skeleton className="h-6 w-32" /> {/* Value placeholder */}
      </div>
    </div>
  );
};

export default SingleRightSideItemDataDisplayShimmer;
