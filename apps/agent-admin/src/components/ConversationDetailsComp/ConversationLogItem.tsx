import AgentMessages from '@breakout/design-system/components/layout/AgentMessages/index';
import { EMPTY_ARRAY, EMPTY_FUNCTION } from '@meaku/core/constants/index';
import { ConversationsTableDisplayContent } from '@meaku/core/types/admin/admin';
import { ViewType } from '@meaku/core/types/common';
import { OrbStatusEnum } from '@meaku/core/types/config';
import { WebSocketMessage } from '@meaku/core/types/webSocketData';
import { useSessionStore } from '../../stores/useSessionStore';
import Typography from '@breakout/design-system/components/Typography/index';

type ConversationLogItemProps = {
  conversation?: ConversationsTableDisplayContent;
  chatHistory?: WebSocketMessage[];
};

const ConversationLogItem = ({ conversation, chatHistory }: ConversationLogItemProps) => {
  const logoURL = useSessionStore((state) => state.activeTenant?.['logo']) ?? null;

  if (!chatHistory || !conversation) {
    return null;
  }

  return (
    <div className="flex w-full items-start justify-between gap-4 self-stretch rounded-2xl border border-gray-200 bg-primary/2.5 p-4">
      <div className="flex w-full flex-col gap-4">
        <div className="flex w-full items-center justify-between gap-2">
          <Typography variant="label-14-medium" className="text-gray-500">
            Conversation log:
          </Typography>
        </div>
        <div className="flex w-full flex-col overflow-auto bg-gray-25">
          {chatHistory?.length && conversation?.session_id ? (
            <AgentMessages
              viewType={ViewType.DASHBOARD}
              sessionId={conversation?.session_id}
              isAMessageBeingProcessed={false}
              setActiveArtifact={EMPTY_FUNCTION}
              setDemoPlayingStatus={EMPTY_FUNCTION}
              setIsArtifactPlaying={EMPTY_FUNCTION}
              orbState={OrbStatusEnum.idle}
              messages={chatHistory}
              showRightPanel={false}
              handleSendUserMessage={EMPTY_FUNCTION}
              initialSuggestedQuestions={EMPTY_ARRAY}
              allowFullWidthForText={true}
              showDemoPreQuestions={false}
              primaryColor={'rgb(var(--primary))'}
              logoURL={logoURL}
              allowFeedback={true}
              lastMessageResponseId={chatHistory[chatHistory.length - 1].response_id}
              orbLogoUrl={''}
              showOrbFromConfig={true}
              invertTextColor={false}
              enableScrollToBottom={false}
            />
          ) : (
            <p className="gradient-text text-center font-semibold">There is No Log for this Session.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConversationLogItem;
