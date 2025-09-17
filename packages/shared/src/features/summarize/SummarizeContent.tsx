import { cn, LucideIcon } from '@meaku/saral';
import type { FeatureContentProps } from '..';
import { FeatureHeader } from '../../components/FeatureHeader';
import { CommandBarModuleTypeSchema } from '@meaku/core/types/api/configuration_response';
import { SummarySuccess } from './components/SummarySuccess';
import { SummaryError } from './components/SummaryError';
import { SummaryInitial } from './components/SummaryInitial';
import { SummaryFooter } from './components/SummaryFooter';
import { useSummary } from './hooks/useSummary';

const { ASK_AI } = CommandBarModuleTypeSchema.enum;

const getSummaryState = (
  summaryContent: string,
  hasError: boolean,
  isSummarizing: boolean,
  handleSummarize: () => void,
) => {
  if (hasError) {
    return <SummaryError onRetry={handleSummarize} isSummarizing={isSummarizing} />;
  }

  return <SummarySuccess isSummarizing={isSummarizing} content={summaryContent} />;
};

/**
 * Renders the main content area based on the current summary state
 */
const renderSummaryContent = (
  summaryContent: string | undefined,
  hasError: boolean,
  isSummarizing: boolean,
  handleSummarize: () => void,
  handleAskAIClick: () => void,
) => {
  if (isSummarizing || summaryContent) {
    return (
      <div className="flex flex-1 min-h-0 flex-col gap-4">
        {getSummaryState(summaryContent || '', hasError, isSummarizing, handleSummarize)}
        <SummaryFooter onAskAIClick={handleAskAIClick} />
      </div>
    );
  }

  return <SummaryInitial onSummarize={handleSummarize} isSummarizing={isSummarizing} />;
};

const SummarizeContent = ({ onClose, onExpand, isExpanded, setActiveFeature }: FeatureContentProps) => {
  const { summaryContent, isSummarizing, clickedOnSummarize, handleSummarize, hasError } = useSummary();

  const handleAskAIClick = () => {
    setActiveFeature?.(ASK_AI);
  };

  return (
    <div
      className={cn(
        'flex w-full min-h-[240px] flex-col rounded-[20px] border border-border-dark bg-background pb-3',
        clickedOnSummarize && 'h-[600px]',
      )}
    >
      <FeatureHeader
        title="Summary"
        icon={<LucideIcon name="clipboard-pen" className="size-5" />}
        onClose={onClose}
        onExpand={onExpand}
        isExpanded={isExpanded}
        ctas={[]}
      />
      <div className="flex flex-1 min-h-0 flex-col justify-center gap-4 px-4 pt-4">
        {renderSummaryContent(summaryContent, hasError, isSummarizing, handleSummarize, handleAskAIClick)}
      </div>
    </div>
  );
};

export default SummarizeContent;
