import Button from '@breakout/design-system/components/layout/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@breakout/design-system/components/Tooltip/index';
import LocationCellValue from './tableCellComp/LocationCellValue';

const TOOLTIP_THRESHOLD = 2;

const TooltipAddedAppliedFilter = ({ appliedFilterValues }: { appliedFilterValues: string[] }) => {
  const shouldShowTooltip = appliedFilterValues.length > TOOLTIP_THRESHOLD;
  const displayingValues = appliedFilterValues.slice(0, TOOLTIP_THRESHOLD);
  const allTooltipValues = appliedFilterValues.slice(TOOLTIP_THRESHOLD);

  return (
    <TooltipProvider>
      <div className="flex flex-wrap items-center justify-start gap-2">
        {displayingValues.map((location: string, index: number) => (
          <span key={index} className="text-sm font-semibold capitalize text-primary">
            <LocationCellValue value={location + (index < displayingValues.length - 1 ? ', ' : '')} />
          </span>
        ))}
        {shouldShowTooltip && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="sm" className="ml-2 h-6">
                +{appliedFilterValues.length - TOOLTIP_THRESHOLD} more
              </Button>
            </TooltipTrigger>
            <TooltipContent
              className="hide-scrollbar flex max-h-96 flex-col overflow-auto bg-white !p-0"
              side="bottom"
              sideOffset={8}
            >
              {allTooltipValues.map((location: string, index: number) => (
                <span
                  key={index}
                  className="border-l-2 border-primary/70 bg-primary/10 px-4 py-2 text-sm font-semibold capitalize text-primary"
                >
                  <LocationCellValue value={location} />
                </span>
              ))}
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    </TooltipProvider>
  );
};

export default TooltipAddedAppliedFilter;
