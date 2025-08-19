import { Typography } from '@meaku/saral';

interface SummaryFooterProps {
  onAskAIClick: () => void;
}

export const SummaryFooter = ({ onAskAIClick }: SummaryFooterProps) => {
  return (
    <Typography variant="body-small" fontWeight="normal" className="text-gray-600 text-center inline">
      Looking for something else?
      <Typography
        variant="body-small"
        fontWeight="semibold"
        className="text-primary text-center inline cursor-pointer pl-1"
        onClick={onAskAIClick}
      >
        Try Ask AI
      </Typography>
    </Typography>
  );
};
