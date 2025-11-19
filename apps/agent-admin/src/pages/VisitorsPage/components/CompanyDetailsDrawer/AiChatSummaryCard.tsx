import PanelCard from './PanelCard';
import AiSparklesIcon from '@breakout/design-system/components/icons/ai-sparkles-icon';
import GithubMarkdownRenderer from '@breakout/design-system/components/layout/GithubMarkdownRenderer';
import Typography from '@breakout/design-system/components/Typography/index';

type AiChatSummaryCardProps = {
  isActive: boolean;
  onClick: () => void;
  conversationSummary?: string | null;
};

const AiChatSummaryCard = ({ isActive, onClick, conversationSummary }: AiChatSummaryCardProps) => {
  const summaryText = conversationSummary ? conversationSummary : 'No conversation summary available for this session';

  return (
    <div>
      <Typography variant="caption-12-medium" className="mb-2 flex items-center gap-1">
        <AiSparklesIcon width="18px" height="18px" className="text-gray-900" />
        AI Chat Summary
      </Typography>
      <PanelCard isActive={isActive} onClick={onClick}>
        <div className="line-clamp-3">
          {conversationSummary ? (
            <GithubMarkdownRenderer markdown={conversationSummary} />
          ) : (
            <span className="text-gray-500">{summaryText}</span>
          )}
        </div>
      </PanelCard>
    </div>
  );
};

export default AiChatSummaryCard;
