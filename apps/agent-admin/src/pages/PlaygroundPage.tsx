import withPageViewWrapper from '../pages/PageViewWrapper';
import Typography from '@breakout/design-system/components/Typography/index';
import { cn } from '@breakout/design-system/lib/cn';
import CustomTabs from '../components/CustomTabs';
import { PLAYGROUND_VIEW_TAB_ITEMS } from '../utils/constants';
import { Info } from 'lucide-react';
import TooltipWrapperDark from '@breakout/design-system/components/Tooltip/TooltipWrapperDark';
import usePlaygroundOptions from '../hooks/usePlaygroundOptions';

const PlaygroundPage = () => {
  const { handlePlaygroundViewChange, view, iframeSrc, isUserView } = usePlaygroundOptions();

  const getTooltipContent = () => {
    return (
      <Typography className="max-w-80" variant="caption-12-medium" textColor="white">
        Preview the user-facing view or switch to Admin View for buyer intent and feedback insights.
      </Typography>
    );
  };

  return (
    <>
      <div className={cn('flex w-full items-center gap-4 self-stretch px-3', isUserView && 'px-0')}>
        <Typography variant="title-18" className="flex-1">
          Playground
        </Typography>
        <div className="flex items-center gap-4">
          <TooltipWrapperDark
            disableHoverableContent
            tooltipSide="left"
            tooltipAlign="center"
            showArrow={true}
            tooltipArrowClassName="-right-1"
            trigger={<Info className="h-4 w-4 stroke-2 text-primary" />}
            showTooltip={true}
            content={getTooltipContent()}
          />
          <CustomTabs
            selectedTab={view}
            handleTabChange={handlePlaygroundViewChange}
            tabItems={PLAYGROUND_VIEW_TAB_ITEMS}
            tabContainerClassName="p-1"
          />
        </div>
      </div>
      {iframeSrc.length > 0 ? (
        <div className="relative z-10 h-[88vh] self-stretch">
          <div id="embedded-breakout-agent" className="relative flex h-full w-full flex-col items-start justify-start">
            <iframe height={'100%'} width={'100%'} src={iframeSrc} />
          </div>
        </div>
      ) : null}
    </>
  );
};

export default withPageViewWrapper(PlaygroundPage);
