import Button from '@breakout/design-system/components/Button/index';
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
        {displayingValues.map((value: string, index: number) => (
          <span key={index} className="text-sm font-semibold capitalize text-gray-600">
            <LocationCellValue
              value={value + (index < displayingValues.length - 1 ? ', ' : '')}
              showTruncatedText={false}
            />
          </span>
        ))}
        {shouldShowTooltip && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="system" className="ml-2 h-6">
                +{appliedFilterValues.length - TOOLTIP_THRESHOLD} more
              </Button>
            </TooltipTrigger>
            <TooltipContent
              className="hide-scrollbar flex max-h-96 flex-col overflow-auto rounded-lg border-2 border-gray-200 bg-white !p-0"
              side="bottom"
              sideOffset={16}
            >
              {allTooltipValues.map((value: string, index: number) => (
                <span key={index} className="bg-gray-100 px-4 py-2 text-sm font-semibold capitalize text-gray-600">
                  <LocationCellValue value={value} showTruncatedText={false} />
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
