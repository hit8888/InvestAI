import { useConversationDetails } from '../../context/ConversationDetailsContext';
import AgentMessages from '@breakout/design-system/components/layout/AgentMessages';
import { ViewType } from '@meaku/core/types/common';
import { OrbStatusEnum } from '@meaku/core/types/config';
import { getTenantIdentifier } from '@meaku/core/utils/index';
import { useCallback, useMemo } from 'react';

const LogTabDisplayContent = () => {
  const { chatHistory, conversation, feedbackData } = useConversationDetails();
  const logoURL = getTenantIdentifier()?.['logo'];

  // Memoize the empty function calling to avoid re-rendering the component
  const handleEmptyFunction = useCallback(() => {}, []);
  const emptyArray = useMemo(() => [], []);
  return (
    <div className="flex max-h-[900px] w-full flex-col overflow-auto bg-gray-25">
      {chatHistory?.length && conversation?.session_id ? (
        <AgentMessages
          viewType={ViewType.DASHBOARD}
          sessionId={conversation?.session_id}
          isAMessageBeingProcessed={false}
          setActiveArtifact={handleEmptyFunction}
          setDemoPlayingStatus={handleEmptyFunction}
          setIsArtifactPlaying={handleEmptyFunction}
          orbState={OrbStatusEnum.idle}
          messages={chatHistory}
          showRightPanel={false}
          handleSendUserMessage={handleEmptyFunction}
          initialSuggestedQuestions={emptyArray}
          allowFullWidthForText={true}
          showDemoPreQuestions={false}
          primaryColor={'rgb(var(--primary))'}
          logoURL={logoURL}
          allowFeedback={true}
          feedbackData={feedbackData}
          lastMessageResponseId={chatHistory[chatHistory.length - 1].response_id}
          orbLogoUrl={''}
          showOrbFromConfig={true}
          invertTextColor={false}
        />
      ) : (
        <p className="gradient-text mt-20 h-screen w-full text-center text-4xl font-semibold">
          There is No Log for this Session.
        </p>
      )}
    </div>
  );
};

export default LogTabDisplayContent;
