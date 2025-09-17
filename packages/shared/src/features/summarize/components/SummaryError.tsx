import { Button, LucideIcon, Typography } from '@meaku/saral';

interface SummaryErrorProps {
  onRetry: () => void;
  isSummarizing: boolean;
}

export const SummaryError = ({ onRetry, isSummarizing }: SummaryErrorProps) => {
  return (
    <>
      <Typography
        variant="body"
        fontWeight="medium"
        className="flex items-center gap-2 text-destructive-1000 bg-destructive-100 rounded-xl p-3"
      >
        <span>
          <LucideIcon name="x" className="size-4 bg-destructive-1000 rounded-full p-0.5 text-white" />
        </span>
        Oops! Couldn't generate summary
      </Typography>
      <Button variant="default" size="sm" onClick={onRetry} disabled={isSummarizing} className="mt-auto">
        <LucideIcon name="refresh-ccw" className="size-4 mr-2" />
        Try Again
      </Button>
    </>
  );
};
