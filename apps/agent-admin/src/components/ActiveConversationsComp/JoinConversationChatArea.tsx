import { getTenantIdentifier } from '@meaku/core/utils/index';
import AgentMessages from '@breakout/design-system/components/layout/AgentMessages';
import { OrbStatusEnum } from '@meaku/core/types/config';
import ArtifactContainer from '@breakout/design-system/components/Artifact/ArtifactContainer';
import { cn } from '@breakout/design-system/lib/cn';
import { ViewType } from '@meaku/core/types/common';
import { LoaderCircle } from 'lucide-react';
import { useMessageStore } from '../../hooks/useMessageStore';
import { useGetArtifactLoadingState } from '../../hooks/useGetArtifactLoadingState';
import useArtifactStore from '@meaku/core/stores/useArtifactStore';
import { useSetArtifactOnNewMessage } from '../../hooks/useSetArtifactOnNewMessage';

interface JoinConversationChatAreaProps {
  sessionId: string;
  isLoading?: boolean;
}

const JoinConversationChatArea = ({ sessionId, isLoading }: JoinConversationChatAreaProps) => {
  const logoURL = getTenantIdentifier()?.['logo'];
  const { messages } = useMessageStore();

  const setActiveArtifact = useArtifactStore((state) => state.setActiveArtifact);
  const { hasGeneratingArtifactEvents } = useGetArtifactLoadingState();
  useSetArtifactOnNewMessage();

  if (isLoading) {
    return (
      <div className="flex w-full grow grow items-center justify-center overflow-hidden rounded-2xl border border-gray-200">
        <div className="animate-spin text-customSecondaryText">
          <LoaderCircle size={36} />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full grow overflow-hidden rounded-2xl border border-gray-200">
      <div className={cn('flex h-full w-full flex-1 gap-2 overflow-hidden')}>
        {messages?.length ? (
          <AgentMessages
            viewType={ViewType.ADMIN}
            sessionId={sessionId}
            isAMessageBeingProcessed={false}
            setActiveArtifact={setActiveArtifact}
            setDemoPlayingStatus={() => {}}
            orbState={OrbStatusEnum.idle}
            messages={messages}
            showRightPanel={true}
            handleSendUserMessage={() => {}}
            initialSuggestedQuestions={[]}
            allowFullWidthForText={false}
            showDemoPreQuestions={false}
            primaryColor={'rgb(var(--primary))'}
            logoURL={logoURL}
            allowFeedback={false}
            orbLogoUrl={''}
            showOrbFromConfig={true}
            lastMessageResponseId={messages[messages.length - 1].response_id}
            invertTextColor={false}
          />
        ) : (
          <p className="mt-20 w-full text-center text-2xl font-semibold">There is no log for this session.</p>
        )}

        <ArtifactContainer
          logoURL={logoURL}
          isMediaTakingFullWidth={true}
          handleSendMessage={() => {}}
          onSlideItemClick={() => {}}
          messages={messages}
          viewType={ViewType.ADMIN}
          isGeneratingArtifact={hasGeneratingArtifactEvents}
        />
      </div>
    </div>
  );
};

export default JoinConversationChatArea;
