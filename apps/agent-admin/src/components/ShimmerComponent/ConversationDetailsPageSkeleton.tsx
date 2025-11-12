import { Skeleton } from '@breakout/design-system/components/shadcn-ui/skeleton';
import {
  CONVERSATION_DETAILS_BREADCRUMB_HEIGHT,
  STICKY_TOP_VALUE_CONVERSATION_DETAILS_PAGE,
} from '../../utils/constants';
import SummaryTabDisplayContentShimmer from './SummaryTabDisplayContentShimmer';
import ProspectAndCompanyDetailsDisplayContainerShimmer from './ProspectAndCompanyDetailsDisplayContainerShimmer';
import MultipleClickableTabShimmer from './MultipleClickableTabShimmer';

const ConversationDetailsPageSkeleton = () => {
  return (
    <div className="flex w-full flex-1 flex-col items-start self-stretch">
      {/* Breadcrumb Section */}
      <div className="sticky top-0 z-10 w-full border-b border-primary/10 bg-white py-5">
        <div className="flex w-full flex-col items-start gap-4 self-stretch">
          <Skeleton className="h-6 w-56" />
        </div>
      </div>

      {/* Navigation Header Section */}
      <div
        className="sticky z-10 flex w-full items-center gap-6 border-b border-primary/10 bg-white py-4"
        style={{
          top: `${CONVERSATION_DETAILS_BREADCRUMB_HEIGHT}px`,
        }}
      >
        {/* Company Name */}
        <div className="flex items-center gap-4">
          <Skeleton className="h-8 w-8" />
          <div className="flex flex-col items-start gap-1">
            <Skeleton className="h-3.5 w-28" />
            <Skeleton className="h-3.5 w-28" />
          </div>
        </div>
        <div className="h-10 border-r border-primary/10" />
        {/* Session ID */}
        <div className="flex flex-1 items-center gap-4">
          <Skeleton className="h-8 w-8" />
          <div className="flex flex-col items-start gap-1">
            <Skeleton className="h-3.5 w-28" />
            <Skeleton className="h-3.5 w-64" />
          </div>
        </div>
        {/* Navigation Buttons */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-9" />
          <Skeleton className="h-9 w-9" />
        </div>
      </div>

      {/* Main Content Section */}
      <div className="flex w-full max-w-full flex-1 items-start self-stretch">
        {/* Left Side - Tabs and Content */}
        <div className="flex max-w-[70%] flex-1 flex-col items-start self-stretch">
          {/* Tabs Section */}
          <div
            className="sticky z-10 flex items-start self-stretch border-b border-primary/10 bg-white py-4"
            style={{
              top: `${STICKY_TOP_VALUE_CONVERSATION_DETAILS_PAGE}px`,
            }}
          >
            <MultipleClickableTabShimmer tabsLength={2} />
          </div>
          {/* Tab Content */}
          <SummaryTabDisplayContentShimmer />
        </div>

        {/* Right Side - Prospect and Company Details */}
        <ProspectAndCompanyDetailsDisplayContainerShimmer />
      </div>
    </div>
  );
};

export default ConversationDetailsPageSkeleton;
