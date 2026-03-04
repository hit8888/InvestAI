import { cn, LucideIcon } from '@neuraltrade/saral';
import type { FeatureContentProps } from '..';
import { FeatureHeader } from '../../components/FeatureHeader';
import { CommandBarModuleTypeSchema } from '@neuraltrade/core/types/api/configuration_response';
import { SummaryContent } from './components/SummaryContent';
import { SummaryError } from './components/SummaryError';
import { SummaryInitial } from './components/SummaryInitial';
import { SummaryFooter } from './components/SummaryFooter';
import { useSummary } from './hooks/useSummary';
import { useEffect } from 'react';
import { getLocalStorageData, setLocalStorageData } from '@neuraltrade/core/utils/storage-utils';

const { ASK_AI, SUMMARIZE } = CommandBarModuleTypeSchema.enum;

const getSummaryState = (
  summaryContent: string,
  hasError: boolean,
  isSummarizing: boolean,
  handleSummarize: () => void,
) => {
  if (hasError) {
    return <SummaryError onRetry={handleSummarize} isSummarizing={isSummarizing} />;
  }

  return <SummaryContent isSummarizing={isSummarizing} content={summaryContent} />;
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
  const { summaryContent, isSummarizing, handleSummarize, hasError } = useSummary();

  const handleAskAIClick = () => {
    setActiveFeature?.(ASK_AI);
  };

  useEffect(() => {
    if (isSummarizing || summaryContent) return;

    const nudgeActionStorageKey = `nudge_action_cta_${SUMMARIZE}`;
    const storageData = getLocalStorageData();
    const nudgeActionCtaSummarize = storageData?.[nudgeActionStorageKey as keyof typeof storageData] ?? false;

    if (nudgeActionCtaSummarize) {
      setLocalStorageData({ [nudgeActionStorageKey]: false });
      handleSummarize();
    }
  }, []);

  return (
    <div
      className={cn('flex w-full min-h-[240px] flex-col rounded-[20px] border border-border-dark bg-background pb-3', {
        'h-[600px]': !!summaryContent || isSummarizing,
      })}
    >
      <FeatureHeader
        title="Summary"
        icon={<LucideIcon name="clipboard-pen" className="size-5" />}
        onClose={onClose}
        onExpand={onExpand}
        isExpanded={isExpanded}
        ctas={[]}
      />
      <div className="flex flex-1 min-h-0 flex-col justify-center gap-4 p-4">
        {renderSummaryContent(summaryContent, hasError, isSummarizing, handleSummarize, handleAskAIClick)}
      </div>
    </div>
  );
};

export default SummarizeContent;
