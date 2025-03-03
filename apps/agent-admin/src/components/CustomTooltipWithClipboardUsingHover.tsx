import CopyToClipboardButton from '@breakout/design-system/components/layout/CopyToClipboardButton';
import {
  TooltipProvider,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipArrow,
} from '@breakout/design-system/components/Tooltip/index';
import React from 'react';

type IProps = {
  toastMessage: string;
  tooltipText: string;
  children?: React.ReactNode;
  showTooltip?: boolean;
};

const CustomTooltipWithClipboardUsingHover = ({ tooltipText, children, toastMessage, showTooltip = true }: IProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger title="" className="block cursor-pointer" asChild>
          {children}
        </TooltipTrigger>
        {showTooltip && (
          <TooltipContent
            sideOffset={-5}
            title=""
            align="end"
            side="bottom"
            className="rounded-lg border-none bg-gray-900 px-3 py-2 text-white"
          >
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium">{tooltipText}</span>
              <CopyToClipboardButton
                copyIconClassname="h-4 w-4 text-white"
                textToCopy={tooltipText}
                toastMessage={toastMessage}
                btnClassName="h-6 w-6 rounded-lg bg-primary-foreground/25 p-1"
              />
            </div>
            <TooltipArrow width={12} height={6} className="relative -right-6 2xl:-right-14" />
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
};

export default CustomTooltipWithClipboardUsingHover;
