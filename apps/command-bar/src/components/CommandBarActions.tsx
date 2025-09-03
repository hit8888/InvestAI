import React from 'react';
import { TooltipProvider } from '@meaku/saral';
import {
  AskAiAction,
  BookMeetingAction,
  SummarizeAction,
  IframeAction,
  VideoLibraryAction,
} from '@meaku/shared/features';
import {
  CommandBarModuleConfigType,
  CommandBarModuleType,
  CommandBarModuleTypeSchema,
} from '@meaku/core/types/api/configuration_response';
import { useCommandBarAnalytics } from '@meaku/core/contexts/CommandBarAnalyticsProvider';
import ANALYTICS_EVENT_NAMES from '@meaku/core/constants/analytics';
import { useCommandBarStore } from '@meaku/shared/stores/useCommandBarStore';

interface CommandBarActionsProps {
  activeFeature: CommandBarModuleType | null;
  setActiveFeature: (buttonType: CommandBarModuleType | null) => void;
}

const { ASK_AI, BOOK_MEETING, SUMMARIZE, IFRAME, VIDEO_LIBRARY } = CommandBarModuleTypeSchema.enum;

const CommandBarActions: React.FC<CommandBarActionsProps> = ({ activeFeature, setActiveFeature }) => {
  const { config } = useCommandBarStore();
  const { trackEvent } = useCommandBarAnalytics();

  const { modules = [] } = config.command_bar ?? {};

  const handleClick = (featureConfig: CommandBarModuleConfigType | undefined) => {
    if (!featureConfig) {
      return;
    }

    const { module_type } = featureConfig;

    setActiveFeature(activeFeature === module_type ? null : module_type);
    trackEvent(ANALYTICS_EVENT_NAMES.COMMAND_BAR.ACTION_CLICK, {
      action_type: module_type,
    });
  };

  // This is to ensure that the ask ai button is always the first button in the command bar
  const orderedActions = [...modules].sort((a, b) => {
    if (a.module_type === ASK_AI && b.module_type !== ASK_AI) return 1;
    if (a.module_type !== ASK_AI && b.module_type === ASK_AI) return -1;
    return 0;
  });

  const renderActionComponent = (featureConfig: CommandBarModuleConfigType) => {
    const isActive = activeFeature === featureConfig.module_type;

    switch (featureConfig.module_type) {
      case ASK_AI:
        return <AskAiAction key={featureConfig.id} isActive={isActive} onClick={handleClick} />;
      case BOOK_MEETING:
        return <BookMeetingAction key={featureConfig.id} isActive={isActive} onClick={handleClick} />;
      case SUMMARIZE:
        return <SummarizeAction key={featureConfig.id} isActive={isActive} onClick={handleClick} />;
      case IFRAME:
        return <IframeAction key={featureConfig.id} isActive={isActive} onClick={handleClick} />;
      case VIDEO_LIBRARY:
        return <VideoLibraryAction key={featureConfig.id} isActive={isActive} onClick={handleClick} />;
      default:
        return null;
    }
  };

  return (
    <TooltipProvider>
      <div className="relative flex flex-col gap-2.5">{orderedActions.map(renderActionComponent)}</div>
    </TooltipProvider>
  );
};

export default CommandBarActions;
