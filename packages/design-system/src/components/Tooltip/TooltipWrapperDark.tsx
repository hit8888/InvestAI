import React from 'react';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent, TooltipArrow } from './index';

interface IProps {
  trigger: React.ReactNode;
  showTooltip: boolean;
  content: React.ReactNode;
  tooltipSide?: 'top' | 'bottom' | 'left' | 'right';
  tooltipAlign?: 'start' | 'center' | 'end';
  tooltipSideOffsetValue?: number;
}

const TooltipWrapperDark = ({
  trigger,
  showTooltip,
  content,
  tooltipSide = 'bottom',
  tooltipAlign = 'end',
  tooltipSideOffsetValue = 80,
}: IProps) => {
  return (
    <TooltipProvider>
      <Tooltip defaultOpen={false}>
        <TooltipTrigger asChild>
          <div className="block cursor-pointer">{trigger}</div>
        </TooltipTrigger>
        {showTooltip && (
          <TooltipContent
            sideOffset={tooltipSide === 'top' ? tooltipSideOffsetValue : 5}
            align={tooltipAlign}
            side={tooltipSide}
            className="z-[9999] rounded-lg border-none bg-gray-900 px-3 py-2 text-white"
          >
            {content}
            <TooltipArrow width={12} height={6} className="fixed -right-6 2xl:right-14" />
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
};

export default TooltipWrapperDark;
