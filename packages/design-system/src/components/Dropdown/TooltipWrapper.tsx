import { cn } from '../../lib/cn';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../Tooltip';

type TooltipWrapperProps = {
  renderTrigger: React.ReactNode;
  tooltipContent: string;
  showTooltipContent?: boolean;
  tooltipSide?: 'left' | 'right' | 'top' | 'bottom';
  tooltipSideOffset?: number;
  className?: string;
};

const TooltipWrapper = ({
  renderTrigger,
  tooltipContent,
  showTooltipContent,
  tooltipSide = 'top',
  tooltipSideOffset = 0,
  className,
}: TooltipWrapperProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{renderTrigger}</TooltipTrigger>
        {showTooltipContent && (
          <TooltipContent side={tooltipSide} sideOffset={tooltipSideOffset} className="bg-white">
            <p className={cn('text-black', className)}>{tooltipContent}</p>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
};

export default TooltipWrapper;
