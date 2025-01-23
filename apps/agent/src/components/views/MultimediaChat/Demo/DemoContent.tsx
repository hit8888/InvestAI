import { memo, useRef, useState } from 'react';
import { ScriptStepType } from '@meaku/core/types/agent';
import { DemoPlayingStatus } from '@meaku/core/types/common';
import { WaitDemoCompleteNotification } from './Notifications/WaitDemoCompleteNotification';
import ANALYTICS_EVENT_NAMES from '@meaku/core/constants/analytics';
import { DemoFlow } from './DemoFlow';
import { RaiseQuestionTrigger } from './RaiseQuestionTrigger';
import { DemoQuestionFlow } from './DemoQuestionFlow';
import useAgentbotAnalytics from '@meaku/core/hooks/useAgentbotAnalytics';

interface IProps {
  demoDetails: ScriptStepType;
  demoPlayingStatus: DemoPlayingStatus;
  setDemoPlayingStatus: (value: DemoPlayingStatus) => void;
  onStepEnd: () => void;
  onFinishDemo: () => void;
  switchToDemo: () => void;
}

const DemoContent = ({
  demoDetails,
  demoPlayingStatus,
  setDemoPlayingStatus,
  onStepEnd,
  onFinishDemo,
  switchToDemo,
}: IProps) => {
  const assetType = demoDetails?.asset_type;
  const isQueryRaisedRef = useRef(false);

  const { trackAgentbotEvent } = useAgentbotAnalytics();

  const [shouldShowDemoAgent, setShowDemoAgent] = useState(false);

  const isDemoPlaying = DemoPlayingStatus.PLAYING === demoPlayingStatus;

  const handleRaiseDemoQuery = (queryRaised: boolean) => {
    isQueryRaisedRef.current = queryRaised;
    trackAgentbotEvent(ANALYTICS_EVENT_NAMES.DEMO_CONVERSATION_INITIATED);
  };

  const showWaitDemoCompleteNotification = isDemoPlaying && shouldShowDemoAgent;
  const showDemoQuestionsFlow = !isDemoPlaying && shouldShowDemoAgent && isQueryRaisedRef;

  const handleAudioEnd = () => {
    if (isQueryRaisedRef.current) {
      setDemoPlayingStatus(DemoPlayingStatus.PAUSED);
      return;
    }
    if (demoDetails?.is_end) {
      trackAgentbotEvent(ANALYTICS_EVENT_NAMES.DEMO_COMPLETED);
      onFinishDemo();
      return;
    }
    onStepEnd();
  };

  const handleResumeDemo = () => {
    setDemoPlayingStatus(DemoPlayingStatus.PLAYING);
    switchToDemo();
  };
  return (
    <>
      <DemoFlow
        demoDetails={demoDetails}
        assetType={assetType}
        setDemoPlayingStatus={setDemoPlayingStatus}
        demoPlayingStatus={demoPlayingStatus}
        onFinishDemo={onFinishDemo}
        handleDemoAudioEnd={handleAudioEnd}
      />
      <DemoQuestionFlow
        handleResumeDemo={handleResumeDemo}
        isQueryRaisedRef={isQueryRaisedRef}
        isOpen={!!showDemoQuestionsFlow}
      />

      <div className="relative flex h-[10%] w-full flex-1 items-center gap-8 py-4">
        <RaiseQuestionTrigger
          shouldShowDemoAgent={shouldShowDemoAgent}
          setShowDemoAgent={setShowDemoAgent}
          onRaiseDemoQuery={handleRaiseDemoQuery}
        />
        {showWaitDemoCompleteNotification && <WaitDemoCompleteNotification variant="default" />}
      </div>
    </>
  );
};

export default memo(DemoContent);
