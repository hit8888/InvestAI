import React from 'react';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent, TooltipArrow } from './index';
import { cn } from '../../lib/cn';

interface IProps {
  trigger: React.ReactNode;
  showTooltip: boolean;
  content: React.ReactNode;
  tooltipSide?: 'top' | 'bottom' | 'left' | 'right';
  tooltipAlign?: 'start' | 'center' | 'end';
  tooltipSideOffsetValue?: number;
  showArrow?: boolean;
  alwaysVisible?: boolean;
  disableHoverableContent?: boolean;
}

const TooltipWrapperDark = ({
  trigger,
  showTooltip,
  content,
  tooltipSide = 'bottom',
  tooltipAlign = 'end',
  tooltipSideOffsetValue = 80,
  showArrow = true,
  alwaysVisible = false,
  disableHoverableContent = false,
}: IProps) => {
  const isTooltipSideValueTop = tooltipSide === 'top';
  return (
    <TooltipProvider disableHoverableContent={disableHoverableContent} delayDuration={200}>
      <Tooltip defaultOpen={alwaysVisible}>
        <TooltipTrigger asChild>
          <div className="block cursor-pointer">{trigger}</div>
        </TooltipTrigger>
        {showTooltip && (
          <TooltipContent
            sideOffset={isTooltipSideValueTop ? tooltipSideOffsetValue : 5}
            align={tooltipAlign}
            side={tooltipSide}
            className={cn('z-[9999] rounded-lg border-none bg-gray-900 px-3 py-2 text-white', {
              'pointer-events-none': alwaysVisible,
            })}
          >
            {content}
            {showArrow && (
              <TooltipArrow
                width={12}
                height={6}
                className={cn('fixed -right-6 2xl:right-14', {
                  'right-8': isTooltipSideValueTop,
                })}
              />
            )}
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
};

export default TooltipWrapperDark;
