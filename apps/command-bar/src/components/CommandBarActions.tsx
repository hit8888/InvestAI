import React from 'react';
import { TooltipProvider } from '@meaku/saral';
import { AskAiAction, BookMeetingAction, SummarizeAction, IframeAction } from '@meaku/shared/features';
import { Message, MessageEventType } from '@meaku/shared/types/message';
import {
  CommandBarModuleConfigType,
  CommandBarModuleType,
  OrbConfigType,
} from '@meaku/core/types/api/configuration_response';
import { useCommandBarAnalytics } from '@meaku/core/contexts/CommandBarAnalyticsProvider';
import ANALYTICS_EVENT_NAMES from '@meaku/core/constants/analytics';

interface CommandBarActionsProps {
  actions: CommandBarModuleConfigType[];
  activeButton: CommandBarModuleType | null;
  onActiveButtonChange: (buttonType: CommandBarModuleType | null) => void;
  sendUserMessage: (message: string, overrides?: Partial<Message>) => void;
  messages: Message[];
  orgConfig: OrbConfigType | undefined;
}

const CommandBarActions: React.FC<CommandBarActionsProps> = ({
  actions,
  activeButton,
  onActiveButtonChange,
  sendUserMessage,
  messages,
  orgConfig,
}) => {
  const { trackEvent } = useCommandBarAnalytics();

  const handleButtonClick = (actionType: CommandBarModuleType) => {
    onActiveButtonChange(activeButton === actionType ? null : actionType);
    trackEvent(ANALYTICS_EVENT_NAMES.COMMAND_BAR.ACTION_CLICK, {
      action_type: actionType,
    });
  };

  const orderedActions = [...actions].sort((a, b) => {
    if (a.module_type === 'ASK_AI' && b.module_type !== 'ASK_AI') return 1;
    if (a.module_type !== 'ASK_AI' && b.module_type === 'ASK_AI') return -1;
    return 0;
  });

  const isBookMeetingEventPresent = messages.some(
    (message) =>
      message.event_type === MessageEventType.BOOK_MEETING ||
      message.event_type === MessageEventType.FORM_ARTIFACT ||
      message.event_type === MessageEventType.CALENDAR_ARTIFACT,
  );

  const renderActionComponent = (action: CommandBarModuleConfigType) => {
    const isActive = activeButton === action.module_type;
    const onClick = () => handleButtonClick(action.module_type);

    switch (action.module_type) {
      case 'ASK_AI':
        return (
          <AskAiAction
            actionId={action.id.toString()}
            key={action.id}
            isActive={isActive}
            onClick={onClick}
            orgConfig={orgConfig}
          />
        );
      case 'BOOK_MEETING':
        return (
          <BookMeetingAction
            actionId={action.id.toString()}
            isBookMeetingEventPresent={isBookMeetingEventPresent}
            sendUserMessage={sendUserMessage}
            key={action.id}
            isActive={isActive}
            onClick={onClick}
          />
        );
      case 'SUMMARIZE':
        return (
          <SummarizeAction actionId={action.id.toString()} key={action.id} isActive={isActive} onClick={onClick} />
        );
      case 'IFRAME':
        return (
          <IframeAction
            actionId={action.id.toString()}
            config={action}
            key={action.id}
            isActive={isActive}
            onClick={onClick}
          />
        );
      default:
        return null;
    }
  };

  return (
    <TooltipProvider>
      <div className="relative flex flex-col gap-8">{orderedActions.map(renderActionComponent)}</div>
    </TooltipProvider>
  );
};

export default CommandBarActions;
