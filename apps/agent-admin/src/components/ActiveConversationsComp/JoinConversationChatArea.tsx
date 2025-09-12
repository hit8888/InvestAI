import { getTenantIdentifier } from '@meaku/core/utils/index';
import AgentMessages from '@breakout/design-system/components/layout/AgentMessages/index';
import { OrbStatusEnum } from '@meaku/core/types/config';
import { cn } from '@breakout/design-system/lib/cn';
import { ViewType } from '@meaku/core/types/common';
import { LoaderCircle } from 'lucide-react';
import { useMessageStore } from '../../hooks/useMessageStore';
import useArtifactStore from '@meaku/core/stores/useArtifactStore';
import { useSetArtifactOnNewMessage } from '../../hooks/useSetArtifactOnNewMessage';
import SummaryCard from './SummaryCard';
import AccountSignalsCard from './AccountSignalsCard';
import ContactDetailsCard from './ContactDetailsCard';
import UserActivity from './UserActivity';
import LandingPageCard from './LandingPageCard';
import useJoinConversationStore from '../../stores/useJoinConversationStore';
import { EMPTY_ARRAY, EMPTY_FUNCTION } from '@meaku/core/constants/index';
import { ActiveConversationDetailsDataResponse } from '@meaku/core/types/admin/admin';

interface JoinConversationChatAreaProps {
  conversationDetails?: ActiveConversationDetailsDataResponse;
  sessionId: string;
  isLoading?: boolean;
}

const JoinConversationChatArea = ({ conversationDetails, sessionId, isLoading }: JoinConversationChatAreaProps) => {
  const logoURL = getTenantIdentifier()?.['logo'];
  const { messages, isUserTyping } = useMessageStore();
  const {
    prospect: { browsed_urls: browsedUrls = [], parent_url: parentUrl, query_params: queryParams } = {},
    session: { start_time: startTime } = {},
  } = conversationDetails ?? {};
  const { currentConversation } = useJoinConversationStore();
  const setActiveArtifact = useArtifactStore((state) => state.setActiveArtifact);
  useSetArtifactOnNewMessage();

  const excludedMessagesEventTypes = ['JOIN_SESSION', 'LEAVE_SESSION'];
  const lastMessageApplicableMessages = messages.filter((message) => {
    if (message?.message && 'event_type' in message.message) {
      return !excludedMessagesEventTypes.includes(message.message.event_type);
    }

    return true;
  });
  const lastMessageResponseId = lastMessageApplicableMessages[lastMessageApplicableMessages.length - 1]?.response_id;

  if (isLoading) {
    return (
      <div className="flex w-full grow items-center justify-center overflow-hidden rounded-2xl border border-gray-200">
        <div className="animate-spin text-customSecondaryText">
          <LoaderCircle size={36} />
        </div>
      </div>
    );
  }

  if (!currentConversation) {
    return (
      <div className="flex h-full w-full items-center justify-center border-l border-gray-200 bg-white p-4">
        <p className="text-gray-500">No conversation data available</p>
      </div>
    );
  }

  return (
    <div className="flex w-full grow overflow-hidden p-2 pb-0">
      <div className={cn('flex h-full w-full flex-1 gap-2 overflow-hidden')}>
        {messages?.length ? (
          <AgentMessages
            viewType={ViewType.ADMIN}
            sessionId={sessionId}
            isAMessageBeingProcessed={false}
            setActiveArtifact={setActiveArtifact}
            setDemoPlayingStatus={EMPTY_FUNCTION}
            setIsArtifactPlaying={EMPTY_FUNCTION}
            orbState={OrbStatusEnum.idle}
            messages={messages}
            showRightPanel={true}
            handleSendUserMessage={EMPTY_FUNCTION}
            initialSuggestedQuestions={EMPTY_ARRAY}
            allowFullWidthForText={false}
            showDemoPreQuestions={false}
            primaryColor={'rgb(var(--primary))'}
            logoURL={logoURL}
            allowFeedback={false}
            orbLogoUrl={''}
            showOrbFromConfig={true}
            lastMessageResponseId={lastMessageResponseId}
            invertTextColor={false}
            enableScrollToBottom={true}
            isTyping={isUserTyping}
          />
        ) : (
          <p className="mt-20 w-full text-center text-2xl font-semibold">There is no log for this session.</p>
        )}

        <div className="flex h-full w-full flex-col gap-2">
          <div className="flex min-h-0 flex-grow gap-4 rounded-2xl bg-gray-900/5 p-4">
            <div className="relative h-full w-3/5">
              <div className="h-full overflow-y-auto p-2 pb-24">
                <UserActivity browsedUrls={[...browsedUrls].reverse()} />
              </div>
              <div className="sticky bottom-0 mx-2">
                <LandingPageCard
                  source={queryParams?.utm_source ?? ''}
                  url={parentUrl ?? ''}
                  timestamp={startTime ?? ''}
                />
              </div>
            </div>
            <div className="flex h-full w-2/5 flex-col gap-4 overflow-y-auto py-2">
              <ContactDetailsCard conversation={currentConversation} />
              <SummaryCard chatSummary={conversationDetails?.chat_summary} />
              <AccountSignalsCard conversation={currentConversation} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoinConversationChatArea;
