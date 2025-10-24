import TooltipWrapperDark from '@breakout/design-system/components/Tooltip/TooltipWrapperDark';
import Typography from '@breakout/design-system/components/Typography/index';
import { Info } from 'lucide-react';

type CardTitleAndDescriptionProps = {
  title?: string;
  description?: string;
  isMandatoryField?: boolean;
  showInfoIcon?: boolean;
  tooltipInfo?: string;
};

const CardTitleAndDescription = ({
  title = '',
  description,
  isMandatoryField = false,
  showInfoIcon = false,
  tooltipInfo,
}: CardTitleAndDescriptionProps) => {
  return (
    <div className="flex w-full flex-1 flex-col items-start justify-center gap-1">
      {title && (
        <div className="flex items-center gap-2">
          <Typography variant={'label-16-medium'} className="w-full flex-1">
            {title}
            {isMandatoryField ? <span className="text-base font-medium text-destructive-1000">*</span> : null}
          </Typography>
          {showInfoIcon && (
            <TooltipWrapperDark
              trigger={<Info className="inline h-4 w-4 text-primary" />}
              content={tooltipInfo}
              showTooltip
              tooltipArrowClassName="left-0"
              tooltipSide="top"
              tooltipAlign="start"
            />
          )}
        </div>
      )}
      {description && (
        <Typography variant={'caption-12-normal'} className="text-gray-500">
          {description}
        </Typography>
      )}
    </div>
  );
};

export default CardTitleAndDescription;
