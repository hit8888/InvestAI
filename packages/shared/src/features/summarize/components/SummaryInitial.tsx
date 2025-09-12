import { Button, Typography } from '@meaku/saral';

interface SummaryInitialProps {
  onSummarize: () => void;
  isSummarizing: boolean;
}

export const SummaryInitial = ({ onSummarize, isSummarizing }: SummaryInitialProps) => {
  return (
    <>
      <Typography variant="heading" fontWeight="semibold">
        Sum up in seconds
      </Typography>
      <Typography variant="body" fontWeight="normal" className="text-gray-600">
        Generate a summary of this page, so you can focus on the highlights.
      </Typography>
      <Button variant="default" size="sm" hasWipers={true} onClick={onSummarize} disabled={isSummarizing}>
        {isSummarizing ? 'Summarizing...' : 'Summarize'}
      </Button>
    </>
  );
};
