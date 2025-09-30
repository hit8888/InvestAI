import { ActionConfig } from '@meaku/shared/features/base/BaseActionComponent';
import { Button, LucideIcon, VideoLibraryIcon } from '@meaku/saral';
import CustomIconImageContainer from '@meaku/shared/features/ask-ai/components/CustomIconImageContainer';
import FallbackOrb from '@meaku/shared/features/ask-ai/components/FallbackOrb';
import { CommandBarModuleTypeSchema } from '@meaku/core/index';
import { OnlineIndicator } from '@meaku/shared/components/AvatarDisplay';

const { ASK_AI, BOOK_MEETING, SUMMARIZE, IFRAME, VIDEO_LIBRARY } = CommandBarModuleTypeSchema.enum;

export const AskAIActionConfig: ActionConfig = {
  moduleType: ASK_AI,
  tooltip: {
    content: 'Ask our AI assistant anything!',
  },
  customRenderer: ({ onClick, featureConfig, config, buttonSize }) => {
    const { orb_config: orbConfig } = config.style_config;
    const customIconUrl = featureConfig?.icon_asset?.public_url ?? undefined;

    const renderContent = () => {
      if (customIconUrl) {
        return (
          <CustomIconImageContainer
            sourceUrl={customIconUrl}
            imageAlt={featureConfig?.name ?? 'Ask AI'}
            size={buttonSize}
          />
        );
      }
      if (orbConfig?.logo_url) {
        return <CustomIconImageContainer sourceUrl={orbConfig.logo_url} imageAlt={'Ask AI'} size={buttonSize} />;
      }
      return <FallbackOrb size={buttonSize} />;
    };

    return (
      <Button
        className="relative rounded-full"
        size="icon"
        data-action-id={`action-ASK_AI`}
        onClick={onClick}
        style={buttonSize ? { width: `${buttonSize}px`, height: `${buttonSize}px` } : undefined}
      >
        {renderContent()}
        {orbConfig?.show_online_indicator && (
          <OnlineIndicator position="bottom-right" size={16} borderWidth={2} offset={3} />
        )}
      </Button>
    );
  },
};

export const BookMeetingActionConfig: ActionConfig = {
  moduleType: BOOK_MEETING,
  icon: {
    fallbackIcon: <LucideIcon name="calendar-days" className="size-5 stroke-[2px]" />,
    customIconClassName: 'h-full w-full rounded-full',
    customIconAlt: 'Book a Meeting',
  },
  tooltip: {
    content: 'Book a call',
  },
};

export const SummarizeActionConfig: ActionConfig = {
  moduleType: SUMMARIZE,
  icon: {
    fallbackIcon: <LucideIcon name="file-text" className="size-5 stroke-[2px]" />,
    customIconClassName: 'h-full w-full rounded-full',
    customIconAlt: 'Summarize',
  },
  tooltip: {
    content: 'Get a quick summary of any page',
  },
};

export const IframeActionConfig: ActionConfig = {
  moduleType: IFRAME,
  icon: {
    fallbackIcon: <LucideIcon name="play" className="ml-1 size-5 stroke-[2px]" />,
    customIconClassName: 'h-full w-full rounded-full',
    customIconAlt: 'Iframe',
  },
  tooltip: {
    content: (featureConfig) => featureConfig?.module_configs?.tooltip_text ?? featureConfig?.name ?? 'Iframe',
  },
  shouldRender: (featureConfig) => {
    return !!featureConfig?.module_configs?.url;
  },
};

export const VideoLibraryActionConfig: ActionConfig = {
  moduleType: VIDEO_LIBRARY,
  icon: {
    fallbackIcon: <VideoLibraryIcon className="size-5 stroke-[2px]" />,
    customIconClassName: 'h-full w-full rounded-full',
    customIconAlt: 'Video Library',
  },
  tooltip: {
    content: 'Video Library',
  },
};

// Configuration mapping for cleaner code
export const ACTION_CONFIGS = {
  [ASK_AI]: AskAIActionConfig,
  [BOOK_MEETING]: BookMeetingActionConfig,
  [SUMMARIZE]: SummarizeActionConfig,
  [IFRAME]: IframeActionConfig,
  [VIDEO_LIBRARY]: VideoLibraryActionConfig,
} as const;
