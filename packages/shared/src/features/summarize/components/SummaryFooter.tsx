import { Typography } from '@neuraltrade/saral';

interface SummaryFooterProps {
  onAskAIClick: () => void;
}

export const SummaryFooter = ({ onAskAIClick }: SummaryFooterProps) => {
  return (
    <Typography variant="body" fontWeight="medium" className="text-foreground/70 text-center inline">
      Looking for something else?
      <span
        className="text-xs font-semibold text-primary text-center inline cursor-pointer pl-1"
        onClick={onAskAIClick}
      >
        Try Ask AI
      </span>
    </Typography>
  );
};
