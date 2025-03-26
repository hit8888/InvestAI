import { Skeleton } from '@breakout/design-system/components/shadcn-ui/skeleton';
import { cn } from '@breakout/design-system/lib/cn';

type IProps = {
  itemKey: string;
  itemIndex: number;
};

const SingleProspectAndCompanyItemDataDisplayShimmer = ({ itemKey, itemIndex }: IProps) => {
  return (
    <div key={itemKey} className={'flex w-full items-start self-stretch px-2 py-4'}>
      <div className="flex w-full items-center justify-start gap-2">
        <Skeleton
          className={cn('h-3.5 w-20', {
            'w-32': itemIndex % 2 === 0,
          })}
        />
      </div>
      <div className="flex w-full justify-end">
        <Skeleton
          className={cn('h-3.5 w-32', {
            'w-40': itemIndex % 2 !== 0,
          })}
        />
      </div>
    </div>
  );
};

export default SingleProspectAndCompanyItemDataDisplayShimmer;
