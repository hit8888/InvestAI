import { useQueryOptions } from '../../hooks/useQueryOptions';
import useConversationDetailsDataQuery from '../../queries/query/useConversationDetailsDataQuery';
import ConversationDetailsDataResponseManager from '../../managers/ConversationDetailsDataManager';
import { useEffect, useMemo } from 'react';
import { useConversationDetails } from '../../context/ConversationDetailsContext';
import { getTenantIdentifier } from '@meaku/core/utils/index';
import AgentMessages from '@breakout/design-system/components/layout/AgentMessages';
import { OrbStatusEnum } from '@meaku/core/types/config';
import ArtifactContainer from '@breakout/design-system/components/Artifact/ArtifactContainer';
import { cn } from '@breakout/design-system/lib/cn';

const JoinConversationChatAreaBody = ({ sessionID }: { sessionID: string }) => {
  // console.log('sessionID', sessionID);
  const {
    chatHistory,
    conversation,
    feedbackData,
    handleSetConversationDetails,
    handleSetChatHistoryDetails,
    handleSetFeedbackDetails,
  } = useConversationDetails();
  const queryOptions = useQueryOptions();

  const { data, isLoading, isError } = useConversationDetailsDataQuery({
    sessionID: sessionID || '',
    queryOptions,
  });

  const detailsManager = useMemo(() => {
    if (!data) return null;

    return new ConversationDetailsDataResponseManager(data);
  }, [data]);

  // Fetch and process conversation details when session ID changes or when loading state changes.
  useEffect(() => {
    if (!detailsManager || isLoading) return;

    try {
      const chatHistoryMessages = detailsManager.getFormattedChatHistory();
      handleSetChatHistoryDetails(chatHistoryMessages);

      const conversationData = detailsManager.getFormattedConversationData() ?? {};
      handleSetConversationDetails(conversationData);

      const feedbackData = detailsManager.getFeedback();
      handleSetFeedbackDetails(feedbackData);
    } catch (error) {
      console.error('Error while processing conversation details', error);
    }

    return () => {
      // Cleanup code here
      handleSetConversationDetails(null);
      handleSetChatHistoryDetails([]);
      handleSetFeedbackDetails([]);
    };
  }, [isLoading]);

  if (isError) {
    console.error('Error while fetching conversation details');
    return null;
  }
  const logoURL = getTenantIdentifier()?.['logo'];
  // const nonDemoFlow = true;
  return (
    <div className="relative z-0 h-[90%] w-full rounded-2xl border border-gray-200">
      <div
        className={cn('flex h-full w-full flex-1 overflow-hidden', {
          'gap-2': true,
        })}
      >
        {chatHistory?.length && conversation?.session_id ? (
          <AgentMessages
            usingForAgent={true}
            sessionId={conversation?.session_id}
            isAMessageBeingProcessed={true}
            setActiveArtifact={() => {}}
            setDemoPlayingStatus={() => {}}
            orbState={OrbStatusEnum.idle}
            messages={chatHistory}
            showRightPanel={true}
            handleSendUserMessage={() => {}}
            initialSuggestedQuestions={[]}
            allowFullWidthForText={true}
            showDemoPreQuestions={false}
            primaryColor={'rgb(var(--primary))'}
            logoURL={logoURL}
            allowFeedback={true}
            feedbackData={feedbackData}
            orbLogoUrl={''}
            lastMessageResponseId={chatHistory[chatHistory.length - 1].response_id}
          />
        ) : (
          <p className="gradient-text mt-20 h-screen w-full text-center text-4xl font-semibold">
            There is No Log for this Session.
          </p>
        )}
        {/* Right Side Artifact Container */}
        <ArtifactContainer
          logoURL={logoURL}
          isMediaTakingFullWidth={true}
          handleSendMessage={() => {}}
          onSlideItemClick={() => {}}
          messages={chatHistory}
        />
        {/* {nonDemoFlow && (
      )} */}
      </div>
    </div>
  );
};

export default JoinConversationChatAreaBody;
