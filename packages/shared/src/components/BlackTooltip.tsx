import { TooltipTrigger, Tooltip, TooltipContent } from '@meaku/saral';
import React from 'react';

type BlackTooltipProps = {
  children: React.ReactNode;
  content: string;
};

const BlackTooltip = ({ children, content }: BlackTooltipProps) => {
  return (
    <Tooltip delayDuration={0}>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent
        arrowPadding={0}
        side="left"
        align="center"
        sideOffset={10}
        className="border-none bg-gray-900 px-3 py-2 text-sm text-white rounded-md shadow-lg animate-scale-in-right overflow-visible"
        arrowClassName="fill-gray-900"
      >
        {content}
      </TooltipContent>
    </Tooltip>
  );
};

export default BlackTooltip;
