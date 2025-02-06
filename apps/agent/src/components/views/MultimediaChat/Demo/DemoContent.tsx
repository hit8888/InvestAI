import { memo, useRef, useState } from 'react';
import { ScriptStepType } from '@meaku/core/types/agent';
import { DemoPlayingStatus } from '@meaku/core/types/common';
import ANALYTICS_EVENT_NAMES from '@meaku/core/constants/analytics';
import { DemoFlow } from './DemoFlow';
import { DemoQuestionFlow } from './DemoQuestionFlow';
import useAgentbotAnalytics from '@meaku/core/hooks/useAgentbotAnalytics';
import { CHAT_ASSET_DELAY_THRESHOLD_IN_MILLISECONDS } from '../../../../constants/chat';
import useSelectedFeatureStore from '../../../../stores/useSelectedFeatureStore';

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
  const { setFirstSlideInDemoFlow } = useSelectedFeatureStore();
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

  const handleOnStepEndWithDelay = () => {
    setTimeout(() => {
      onStepEnd();
    }, CHAT_ASSET_DELAY_THRESHOLD_IN_MILLISECONDS);
  };

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
    handleOnStepEndWithDelay();
    setFirstSlideInDemoFlow(false);
  };

  const handleResumeDemo = () => {
    setDemoPlayingStatus(DemoPlayingStatus.PLAYING);
    switchToDemo();
    setFirstSlideInDemoFlow(false);
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
        shouldShowDemoAgent={shouldShowDemoAgent}
        setShowDemoAgent={setShowDemoAgent}
        onRaiseDemoQuery={handleRaiseDemoQuery}
        showWaitDemoCompleteNotification={showWaitDemoCompleteNotification}
      />
      <DemoQuestionFlow
        handleResumeDemo={handleResumeDemo}
        isQueryRaisedRef={isQueryRaisedRef}
        isOpen={!!showDemoQuestionsFlow}
      />
    </>
  );
};

export default memo(DemoContent);
