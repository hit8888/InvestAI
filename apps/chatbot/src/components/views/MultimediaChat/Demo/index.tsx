import { cn } from '@breakout/design-system/lib/cn';
import { IWebSocketHandleMessage } from '../../../../hooks/useWebSocketChat';
import { DemoEvent } from '@meaku/core/types/webSocket';
import DemoContent from './DemoContent';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { FeatureSelectionDTOType, ScriptStepType } from '@meaku/core/types/chat';

import { DemoPlayingStatus } from '@meaku/core/types/common';
import { Loader } from 'lucide-react';
import { GetArtifactPayload } from '@meaku/core/types/api';
import { SelectDemoFeatures } from './SelectDemoFeatures';

interface IProps {
  handleFinishDemo: () => void;
  handleSendMessage: (data: IWebSocketHandleMessage) => void;
  demoDetails: ScriptStepType | null;
  demoPlayingStatus: DemoPlayingStatus;
  setDemoPlayingStatus: Dispatch<SetStateAction<DemoPlayingStatus>>;
  activeArtifact: GetArtifactPayload | null;
  demoFeatures: FeatureSelectionDTOType[];
  isDemoAvailable: boolean;
}

const Demo = ({
  handleFinishDemo,
  handleSendMessage,
  demoDetails,
  demoPlayingStatus,
  setDemoPlayingStatus,
  activeArtifact,
  demoFeatures,
  isDemoAvailable,
}: IProps) => {
  const handleStepEnd = () => {
    handleSendMessage({ message: '', eventType: DemoEvent.DEMO_NEXT, eventData: {} });
  };

  const onFinishDemo = () => {
    console.log('aaaaaaaaa');
    handleFinishDemo();
  };
  useEffect(() => {
    if (demoDetails && demoPlayingStatus === DemoPlayingStatus.GENRATING_DEMO) {
      setDemoPlayingStatus(DemoPlayingStatus.PLAYING);
    }
  }, [demoDetails]);

  if (activeArtifact) {
    return null;
  } //This is explicitly specified for cases where the use selects an artifact using artifact preview

  if (!isDemoAvailable) {
    return null;
  }

  if (demoPlayingStatus === DemoPlayingStatus.INITIAL && demoFeatures.length > 0) {
    return (
      <SelectDemoFeatures
        demoFeatures={demoFeatures}
        handleSendMessage={handleSendMessage}
        setDemoPlayingStatus={setDemoPlayingStatus}
      />
    );
  }

  if (demoPlayingStatus === DemoPlayingStatus.GENRATING_DEMO) {
    return (
      <div className="col-span-2 mr-2 pl-2">
        <div className="flex h-full w-full items-center justify-center">
          <div className="flex items-center justify-center gap-2">
            <span className="text-primary">Hold on. Creating demo</span>
            <div className=" animate-spin ">
              <Loader color="rgb(var(--primary)" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (demoPlayingStatus === DemoPlayingStatus.INITIAL) {
    return null;
  }

  if (!demoDetails) {
    return null;
  }

  return (
    <div className={cn('col-span-3 mr-2 overflow-hidden pl-2')}>
      <DemoContent
        demoDetails={demoDetails}
        key={demoDetails?.asset_url}
        setDemoPlayingStatus={setDemoPlayingStatus}
        demoPlayingStatus={demoPlayingStatus}
        onStepEnd={handleStepEnd}
        onFinishDemo={onFinishDemo}
      />
    </div>
  );
};

export { Demo };
