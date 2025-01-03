import { useState } from 'react';

import WaitDemoCompleteNotification from './WaitDemoCompleteNotification';
import AudioOrb from '@breakout/design-system/components/AudioOrb/index';

import { AskQuestionContainer } from './AskQuestionContainer';
import { FinishDemo } from './FinishDemo';

interface IProps {
  isDemoPlaying: boolean;
  onRaiseDemoQuery: (queryRaised: boolean) => void;
  onCloseDemoChat: () => void;
  onFinishDemo: () => void;
  onPause: () => void;
}

export function DemoFooter({ isDemoPlaying, onRaiseDemoQuery, onCloseDemoChat, onFinishDemo, onPause }: IProps) {
  const [isAgentEnabled, setShowDemoAgent] = useState(false);

  const showWaitDemoCompleteNotification = isDemoPlaying && isAgentEnabled;

  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex items-center gap-8">
        <AskQuestionContainer
          isAgentEnabled={isAgentEnabled}
          setShowDemoAgent={setShowDemoAgent}
          onRaiseDemoQuery={onRaiseDemoQuery}
          onCloseDemoChat={onCloseDemoChat}
          isDemoPlaying={isDemoPlaying}
        />
        {showWaitDemoCompleteNotification && <WaitDemoCompleteNotification />}
        <div className="absolute left-1/2 -translate-x-1/2">
          <AudioOrb color="rgb(var(--primary))" height={44} width={44} waveSize={6} />
        </div>
      </div>
      <FinishDemo onFinishDemo={onFinishDemo} onPause={onPause} />
    </div>
  );
}
