import { useState } from 'react';

import WaitDemoCompleteNotification from './WaitDemoCompleteNotification';
import AudioOrb from '@breakout/design-system/components/AudioOrb/index';

import { AskQuestionContainer } from './AskQuestionContainer';
import { FinishDemo } from './FinishDemo';
import useAgentbotAnalytics from '../../../../hooks/useAgentbotAnalytics';
import ANALYTICS_EVENT_NAMES from '@meaku/core/constants/analytics';

interface IProps {
  isDemoPlaying: boolean;
  onRaiseDemoQuery: (queryRaised: boolean) => void;
  onCloseDemoAgent: () => void;
  onFinishDemo: () => void;
  onPause: () => void;
}

export function DemoFooter({ isDemoPlaying, onRaiseDemoQuery, onCloseDemoAgent, onFinishDemo, onPause }: IProps) {
  const [isAgentEnabled, setShowDemoAgent] = useState(false);
  const { trackAgentbotEvent } = useAgentbotAnalytics();

  const showWaitDemoCompleteNotification = isDemoPlaying && isAgentEnabled;

  const handleRaiseDemoQuery = (selectedValue: boolean) => {
    trackAgentbotEvent(ANALYTICS_EVENT_NAMES.DEMO_CONVERSATION_INITIATED);
    onRaiseDemoQuery(selectedValue);
  };

  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex items-center gap-8">
        <AskQuestionContainer
          isAgentEnabled={isAgentEnabled}
          setShowDemoAgent={setShowDemoAgent}
          onRaiseDemoQuery={handleRaiseDemoQuery}
          onCloseDemoAgent={onCloseDemoAgent}
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
