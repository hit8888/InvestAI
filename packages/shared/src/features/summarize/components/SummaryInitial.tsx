import { Button, Markdown, Typography } from '@meaku/saral';
import useFeatureConfig from '../../../hooks/useFeatureConfig';

interface SummaryInitialProps {
  onSummarize: () => void;
  isSummarizing: boolean;
}

export const SummaryInitial = ({ onSummarize, isSummarizing }: SummaryInitialProps) => {
  const featureConfig = useFeatureConfig('SUMMARIZE');
  const description = featureConfig?.description ?? '';

  if (isSummarizing) return null;

  return description.length > 0 ? (
    <div className="w-full flex flex-col items-start justify-start p-4">
      <Markdown markdown={description} />
    </div>
  ) : (
    <>
      <Typography variant="heading" fontWeight="semibold">
        Sum up in seconds
      </Typography>
      <Typography variant="body" fontWeight="normal" className="text-gray-600">
        Generate a summary of this page, so you can focus on the highlights.
      </Typography>
      <Button hasWipers variant="default" size="sm" onClick={onSummarize}>
        Summarize
      </Button>
    </>
  );
};
