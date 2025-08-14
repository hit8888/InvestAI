import { TooltipTrigger, Tooltip, TooltipContent } from '@meaku/saral';

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
        className="border-none bg-gray-900 px-3 py-2 text-sm text-white"
        arrowClassName="fill-gray-900"
        animation={{
          initial: { x: 8, opacity: 0 },
          animate: { x: 0, opacity: 1 },
          exit: { x: 8, opacity: 0 },
          transition: { duration: 0.15, ease: 'easeInOut' },
        }}
      >
        {content}
      </TooltipContent>
    </Tooltip>
  );
};

export default BlackTooltip;
