import React from 'react';
import CopyToClipboardButton from '@breakout/design-system/components/layout/CopyToClipboardButton';
import TooltipWrapperDark from '@breakout/design-system/components/Tooltip/TooltipWrapperDark';

type IProps = {
  toastMessage: string;
  tooltipText: string;
  children?: React.ReactNode;
  showTooltip?: boolean;
  contentMaxWidth?: string;
};

const CustomTooltipWithClipboardUsingHover = ({
  tooltipText,
  children,
  toastMessage,
  showTooltip = true,
  contentMaxWidth = 'max-w-full',
}: IProps) => {
  return (
    <TooltipWrapperDark
      trigger={children}
      showTooltip={showTooltip}
      content={
        <div className={`flex w-fit items-center justify-between gap-2 ${contentMaxWidth}`}>
          <span className="text-sm font-medium">{tooltipText}</span>
          <CopyToClipboardButton
            copyIconClassname="h-4 w-4 text-white"
            textToCopy={tooltipText}
            toastMessage={toastMessage}
            btnClassName="h-6 w-6 rounded-lg bg-primary-foreground/25 p-1"
          />
        </div>
      }
    />
  );
};

export default CustomTooltipWithClipboardUsingHover;
