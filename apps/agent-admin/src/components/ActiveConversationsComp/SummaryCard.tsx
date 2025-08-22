import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import AiSparklesIcon from '@breakout/design-system/components/icons/ai-sparkles-icon';
import Button from '@breakout/design-system/components/Button/index';
import Typography from '@breakout/design-system/components/Typography/index';

const SUMMARY_TRIM_LENGTH = 150;

interface SummaryCardProps {
  chatSummary?: string;
}

const SummaryCard = ({ chatSummary }: SummaryCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const summaryText =
    chatSummary || 'No summary available yet. The AI will generate a summary as the conversation progresses.';

  const shouldShowToggle = summaryText.length > SUMMARY_TRIM_LENGTH;
  const displayText =
    shouldShowToggle && !isExpanded ? `${summaryText.substring(0, SUMMARY_TRIM_LENGTH)}...` : summaryText;

  return (
    <div className="rounded-lg bg-gradient-to-r from-[#A9A4FF] via-[#DCADFC] to-[#6FC8FC] p-0.5 shadow-md">
      <div className="flex flex-col gap-3 rounded-md bg-white p-4">
        <div className="flex items-center gap-2">
          <AiSparklesIcon className="h-6 w-5" />
          <Typography variant="label-14-semibold" textColor="default" as="h3">
            Summary
          </Typography>
        </div>

        <Typography variant="body-14" textColor={chatSummary ? 'default' : 'gray500'}>
          {displayText}
        </Typography>

        {shouldShowToggle && (
          <Button
            onClick={() => setIsExpanded(!isExpanded)}
            variant="tertiary"
            size="small"
            rightIcon={isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            className="self-end"
          >
            {isExpanded ? 'Show Less' : 'Show More'}
          </Button>
        )}
      </div>
    </div>
  );
};

export default SummaryCard;
