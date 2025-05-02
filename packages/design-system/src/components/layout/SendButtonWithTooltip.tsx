import React from 'react';
import TooltipWrapperDark from '../Tooltip/TooltipWrapperDark';

type IProps = {
  children: React.ReactNode;
  showTooltip: boolean;
  tooltipText: string;
};

const SendButtonWithTooltip = ({ children, showTooltip, tooltipText }: IProps) => {
  return (
    <TooltipWrapperDark
      tooltipSide="top"
      tooltipAlign="end"
      tooltipSideOffsetValue={10}
      trigger={children}
      showTooltip={showTooltip}
      content={<p>{tooltipText}</p>}
    />
  );
};

export default SendButtonWithTooltip;
