import { Icons } from '@meaku/saral';
import type { FeatureContentProps } from '..';
import { FeatureHeader } from '../../components/FeatureHeader';
import { CommandBarModuleTypeSchema } from '@meaku/core/types/api/configuration_response';
import { getActiveFeatureBottomOffset } from '../../components/FeatureContentWrapper';
import { SummarySuccess } from './components/SummarySuccess';
import { SummaryError } from './components/SummaryError';
import { SummaryInitial } from './components/SummaryInitial';
import { SummaryFooter } from './components/SummaryFooter';
import { useSummary } from './hooks/useSummary';

const { ASK_AI, SUMMARIZE } = CommandBarModuleTypeSchema.enum;

const SummarizeContent = ({ onClose, onExpand, isExpanded, setActiveFeature }: FeatureContentProps) => {
  const { summaryContent, isSummarizing, handleSummarize, hasError } = useSummary();

  const handleAskAIClick = () => {
    setActiveFeature?.(ASK_AI);
  };

  return (
    <div
      className="flex w-full min-h-64 flex-col space-y-1 rounded-[20px] border border-border-dark bg-card pb-3 shadow-elevation-md"
      style={{ maxHeight: `calc(100dvh - ${getActiveFeatureBottomOffset(SUMMARIZE) + 24}px)` }}
    >
      <FeatureHeader
        title="Summary"
        icon={<Icons.ClipboardPen className="size-5" />}
        onClose={onClose}
        onExpand={onExpand}
        isExpanded={isExpanded}
        ctas={[]}
      />
      <div className="flex flex-1 min-h-0 flex-col gap-4 px-4">
        {summaryContent ? (
          <div className="flex flex-1 min-h-0 flex-col gap-4">
            {!hasError ? (
              <SummarySuccess content={summaryContent} />
            ) : (
              <SummaryError onRetry={handleSummarize} isSummarizing={isSummarizing} />
            )}
            <SummaryFooter onAskAIClick={handleAskAIClick} />
          </div>
        ) : (
          <SummaryInitial onSummarize={handleSummarize} isSummarizing={isSummarizing} />
        )}
      </div>
    </div>
  );
};

export default SummarizeContent;
