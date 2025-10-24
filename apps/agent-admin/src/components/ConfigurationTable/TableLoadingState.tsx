import { Skeleton } from '@breakout/design-system/components/shadcn-ui/skeleton';
import AgentConfigHeader from '../../components/AgentManagement/AgentConfigHeader';

type LoadingStateProps = {
  title: string;
  description: string;
};

const TableLoadingState = ({ title, description }: LoadingStateProps) => {
  return (
    <div className="flex-start flex w-full flex-col gap-11 self-stretch">
      <AgentConfigHeader
        headerLabel={title}
        subHeading={description}
        headerVariant={'title-18'}
        subHeadingVariant={'body-14'}
      />
      <div className="flex max-w-2xl flex-col gap-12 self-stretch">
        <ShimmerSection />
      </div>
    </div>
  );
};

const ShimmerSection = () => {
  return (
    <div className="flex w-full flex-col gap-6 rounded-2xl border border-gray-200 bg-gray-25 p-6 pt-4">
      <Skeleton className="h-10 w-full" />
      <div className="flex w-full justify-end">
        <Skeleton className="h-10 w-20" />
      </div>
    </div>
  );
};

export default TableLoadingState;
