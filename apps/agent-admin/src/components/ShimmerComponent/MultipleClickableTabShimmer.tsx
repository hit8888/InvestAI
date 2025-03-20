import { Skeleton } from '@breakout/design-system/components/shadcn-ui/skeleton';

type IProps = {
  tabsLength: number;
};

const MultipleClickableTabShimmer = ({ tabsLength }: IProps) => {
  return (
    <div className="flex items-center gap-4">
      {Array.from({ length: tabsLength }).map((_, index) => (
        <Skeleton key={index} className="h-10 w-32" />
      ))}
    </div>
  );
};

export default MultipleClickableTabShimmer;
