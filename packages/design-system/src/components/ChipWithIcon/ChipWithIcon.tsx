import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@breakout/design-system/components/Tooltip/index';

const ChipWithIcon = ({
  name,
  iconUrl,
  iconWidth = 22,
  iconHeight = 22,
}: {
  name: string | undefined;
  iconUrl: string;
  iconWidth?: number;
  iconHeight?: number;
}) => {
  if (!name) {
    return null;
  }

  return (
    <TooltipProvider>
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-2 overflow-hidden rounded-full bg-gray-200 px-3 py-1 text-sm font-medium text-gray-600">
            <div className="max-w-20 overflow-hidden text-ellipsis whitespace-nowrap"> {name} </div>
            {iconUrl ? (
              <img
                src={iconUrl}
                className="rounded-full bg-transparent_white_32 p-1"
                width={iconWidth}
                height={iconHeight}
                alt="flag-icon"
              />
            ) : null}
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" className="bg-gray-900 text-white">
          {name}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ChipWithIcon;
