import { Button, Markdown, Typography } from '@neuraltrade/saral';
import useFeatureConfig from '../../../hooks/useFeatureConfig';

interface SummaryInitialProps {
  onSummarize: () => void;
  isSummarizing: boolean;
}

export const SummaryInitial = ({ onSummarize, isSummarizing }: SummaryInitialProps) => {
  const featureConfig = useFeatureConfig('SUMMARIZE');
  const description = featureConfig?.description ?? '';

  if (isSummarizing) return null;

  return (
    <>
      <Typography variant="heading" fontWeight="semibold">
        Sum up in seconds
      </Typography>
      <Typography variant="body" fontWeight="normal" className="text-gray-600">
        {description.length > 0 ? (
          <Markdown markdown={description} />
        ) : (
          'Generate a summary of this page, so you can focus on the highlights.'
        )}
      </Typography>
      <Button hasWipers variant="default" size="sm" onClick={onSummarize}>
        Summarize
      </Button>
    </>
  );
};
