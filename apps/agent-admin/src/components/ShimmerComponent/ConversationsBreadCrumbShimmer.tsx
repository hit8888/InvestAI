import { Skeleton } from '@breakout/design-system/components/shadcn-ui/skeleton';

const ConversationsBreadCrumbShimmer = () => {
  return (
    <div className="flex w-full flex-col items-start gap-4 self-stretch">
      <Skeleton className="h-6 w-56" />
    </div>
  );
};

export default ConversationsBreadCrumbShimmer;
