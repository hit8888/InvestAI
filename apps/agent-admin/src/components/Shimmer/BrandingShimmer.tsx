import { Skeleton } from '@breakout/design-system/components/shadcn-ui/skeleton';
import Typography from '@breakout/design-system/components/Typography/index';

export const BrandingShimmer = () => {
  return (
    <div className="flex-start flex w-full flex-col gap-8 self-stretch">
      <AgentConfigHeader headerLabel="Branding" />
      <div className="flex max-w-2xl flex-col gap-12 self-stretch">
        <div className="flex w-full flex-col gap-4">
          <Typography variant="title-18">{'Logo & Name'}</Typography>
          <div className="flex w-full flex-col gap-6 rounded-2xl border border-gray-200 bg-gray-25 p-6 pt-4">
            {/* Full Logo Section */}
            <div className="flex w-full items-center justify-between gap-8 self-stretch">
              <div className="flex flex-col gap-2">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-64" />
              </div>
              <Skeleton className="h-[60px] w-[260px]" />
            </div>
            <div className="w-full border-b border-gray-200"></div>

            {/* Favicon Section */}
            <div className="flex w-full flex-1 items-center justify-between gap-8 self-stretch">
              <div className="flex flex-col gap-2">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-64" />
              </div>
              <Skeleton className="h-[60px] w-[60px] rounded-md" />
            </div>
            <div className="w-full border-b border-gray-200"></div>

            {/* Name Section */}
            <div className="flex w-full items-center justify-between gap-8 self-stretch">
              <div className="flex flex-col gap-2">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-64" />
              </div>
              <Skeleton className="h-10 w-[260px]" />
            </div>
          </div>
        </div>

        {/* Colors Section */}
        <div className="flex w-full flex-col gap-4">
          <Typography variant="title-18">{'Colors'}</Typography>
          <div className="flex w-full flex-col gap-6 rounded-2xl border border-gray-200 bg-gray-25 p-6 pt-4">
            {/* Primary Color */}
            <div className="flex w-full flex-1 items-center justify-between gap-8 self-stretch">
              <div className="flex flex-col gap-2">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-64" />
              </div>
              <Skeleton className="h-10 w-[260px]" />
            </div>
            <div className="w-full border-b border-gray-200"></div>

            {/* Secondary Color */}
            <div className="flex w-full items-center justify-between gap-8 self-stretch">
              <div className="flex flex-col gap-2">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-64" />
              </div>
              <Skeleton className="h-10 w-[260px]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AgentConfigHeader = ({ headerLabel }: { headerLabel: string }) => {
  return (
    <div className="flex w-full items-center justify-between">
      <Typography variant="title-24">{headerLabel}</Typography>
    </div>
  );
};
