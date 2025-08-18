import { useMemo } from 'react';
import { FeatureHeader } from '../../components/FeatureHeader';
import { Icons, KatyIcon } from '@meaku/saral';
import type { FeatureContentProps } from '../';
import { AskAiInput } from './AskAiInput';
import { Messages } from './Messages';
import { useAvatarSelection } from '../../hooks/useAvatarSelection';
import { checkIfCTAButtonShown } from '../../utils/common';
import { useCommandBarStore } from '../../stores/useCommandBarStore';
import { useWsClient } from '../../hooks/useWsClient';

const AskAiContent = ({ onClose, onExpand, isExpanded }: FeatureContentProps) => {
  const {
    suggestedQuestions,
    isStreaming,
    getRenderableMessages,
    isDiscoveryQuestionShown,
    clearSuggestedQuestionsIfDiscoveryShown,
    isLoading,
    messages,
    settings,
    config,
    sessionData,
  } = useCommandBarStore();

  const askaiConfig = useMemo(
    () => ({
      agent_name: config?.agent_name ?? '',
      welcome_message: config?.body?.welcome_message ?? '',
      ctas: [
        {
          text: config.body.cta_config?.text ?? 'Contact Sales',
          message: config.body.cta_config?.message ?? 'I want to book a demo for the product.',
          url: config.body.cta_config?.url ?? '',
        },
      ],
      welcomeQuestions: config?.body?.welcome_message?.suggested_questions ?? [],
    }),
    [config],
  );

  const { sendUserMessage } = useWsClient();

  // Use session_id if available, otherwise use a combination of agentId and prospectId
  const avatarKey = config.session_id || `${settings.agent_id}-${config.prospect_id}`;
  const { selectedAvatar, isAvatarLoaded } = useAvatarSelection(avatarKey);

  const shouldBookMeetingCTAButtonShow = checkIfCTAButtonShown(messages ?? []);

  return (
    <div
      className="flex w-full flex-col space-y-1 rounded-[20px] border border-border-dark bg-card"
      style={{ boxShadow: '0 0 24px 0 rgba(0, 0, 0, 0.24)', height: 'min(100vh, 680px)' }}
    >
      <FeatureHeader
        title={`${askaiConfig?.agent_name} - AI Copilot`}
        welcomeMessage={messages?.length === 0 ? askaiConfig?.welcome_message.message : undefined}
        icon={
          isAvatarLoaded && selectedAvatar ? <selectedAvatar.Component size={48} /> : <KatyIcon className="h-12 w-12" />
        }
        onClose={onClose}
        onExpand={onExpand}
        isExpanded={isExpanded}
        shouldBookMeetingCTAButtonShow={shouldBookMeetingCTAButtonShow}
        ctas={askaiConfig?.ctas ?? []}
        sendUserMessage={sendUserMessage}
      />
      <div className="h-10 w-full flex-1  p-2 pt-0">
        <div className="flex h-full w-full flex-col rounded-[16px] border bg-background">
          <div className="relative h-[calc(100%-76px)] flex-1">
            {!sessionData ? (
              <div className="absolute bottom-0 flex w-full items-center justify-center gap-3">
                <Icons.CircleDashed className="h-3 w-3 animate-spin text-primary" />
                <p className="text-xs text-muted-foreground">Initialising...</p>
              </div>
            ) : null}
            <Messages
              messages={messages ?? []}
              sendUserMessage={sendUserMessage}
              selectedAvatar={selectedAvatar}
              suggestedQuestions={suggestedQuestions}
              isStreaming={isStreaming}
              isLoading={isLoading}
              getRenderableMessages={getRenderableMessages}
              isDiscoveryQuestionShown={isDiscoveryQuestionShown}
              clearSuggestedQuestionsIfDiscoveryShown={clearSuggestedQuestionsIfDiscoveryShown}
            />
          </div>
          <AskAiInput sendUserMessage={sendUserMessage} disabled={(!sessionData || isLoading) ?? false} />
        </div>
      </div>
    </div>
  );
};

export default AskAiContent;
