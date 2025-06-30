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
  tooltipArrowClassName?: string;
  tooltipContentClassName?: string;
  triggerWrapperClassName?: string;
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
  tooltipArrowClassName,
  tooltipContentClassName,
  triggerWrapperClassName,
}: IProps) => {
  const isTooltipSideValueTop = tooltipSide === 'top' || tooltipSide === 'bottom';
  return (
    <TooltipProvider disableHoverableContent={disableHoverableContent} delayDuration={200}>
      <Tooltip defaultOpen={alwaysVisible}>
        <TooltipTrigger asChild>
          <div className={cn(triggerWrapperClassName, 'block cursor-pointer')}>{trigger}</div>
        </TooltipTrigger>
        {showTooltip && (
          <TooltipContent
            sideOffset={isTooltipSideValueTop ? tooltipSideOffsetValue : 5}
            align={tooltipAlign}
            side={tooltipSide}
            className={cn(tooltipContentClassName, 'z-[9999] rounded-lg border-none bg-gray-900 px-3 py-2 text-white', {
              'pointer-events-none': alwaysVisible,
            })}
          >
            {content}
            {showArrow && (
              <TooltipArrow
                width={12}
                height={6}
                className={cn(
                  'fixed -right-6 2xl:right-14',
                  { 'right-8': isTooltipSideValueTop },
                  tooltipArrowClassName,
                )}
              />
            )}
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
};

export default TooltipWrapperDark;
