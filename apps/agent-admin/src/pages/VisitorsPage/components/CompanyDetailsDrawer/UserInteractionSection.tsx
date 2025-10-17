import AiSparklesIcon from '@breakout/design-system/components/icons/ai-sparkles-icon';
import GithubMarkdownRenderer from '@breakout/design-system/components/layout/GithubMarkdownRenderer';
import Typography from '@breakout/design-system/components/Typography/index';

type UserInteractionSectionProps = {
  conversationSummary?: string;
  onViewConversationDetails: () => void;
};

const UserInteractionSection = ({ conversationSummary, onViewConversationDetails }: UserInteractionSectionProps) => {
  return (
    <div>
      <Typography variant="caption-12-medium" className="mb-2 flex items-center">
        <AiSparklesIcon width="18px" height="18px" className="mr-1 inline" />
        AI Chat Summary
      </Typography>
      <div className="w-full rounded-2xl border border-gray-200 bg-gray-25 p-4">
        <div className="flex flex-col gap-4 rounded-2xl">
          <div className="flex flex-col gap-2 overflow-hidden">
            <p className={`line-clamp-3 text-sm text-gray-700`}>
              {conversationSummary ? (
                <GithubMarkdownRenderer markdown={conversationSummary ?? ''} />
              ) : (
                'No conversation summary available for this session'
              )}
            </p>
          </div>

          <button className="cursor-pointer self-start text-primaryV2 underline" onClick={onViewConversationDetails}>
            <Typography variant="caption-12-medium" className="text-primaryV2">
              ← View Log
            </Typography>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserInteractionSection;
