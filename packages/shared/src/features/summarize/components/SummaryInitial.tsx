import { Button, Typography } from '@meaku/saral';

interface SummaryInitialProps {
  onSummarize: () => void;
  isSummarizing: boolean;
}

export const SummaryInitial = ({ onSummarize, isSummarizing }: SummaryInitialProps) => {
  return (
    <>
      <Typography variant="heading" fontWeight="semibold">
        Summarize this page
      </Typography>
      <Typography variant="body" fontWeight="normal" className="text-gray-600">
        Press "Summarize This Page" and we'll instantly scan the content, then return a short, bullet‑point
        digest—perfect for quick reads, sharing with your team, or saving for later.
      </Typography>
      <Button variant="default" size="sm" onClick={onSummarize} disabled={isSummarizing}>
        {isSummarizing ? 'Summarizing...' : 'Summarize This Page'}
      </Button>
    </>
  );
};
