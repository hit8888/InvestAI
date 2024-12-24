import { cn } from '@breakout/design-system/lib/cn';
import { IWebSocketHandleMessage } from '../../../../hooks/useWebSocketChat';
import { DemoEvent } from '@meaku/core/types/webSocket';
import DemoContent from './DemoContent';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { ScriptStepType } from '@meaku/core/types/chat';
import Button from '@breakout/design-system/components/layout/button';
import { DemoPlayingStatus } from '@meaku/core/types/common';
import { Loader } from 'lucide-react';
import { GetArtifactPayload } from '@meaku/core/types/api';

interface IProps {
  handleFinishDemo: () => void;
  handleSendMessage: (data: IWebSocketHandleMessage) => void;
  demoDetails: ScriptStepType | null;
  isDemoAvailable: boolean;
  demoPlayingStatus: DemoPlayingStatus;
  setDemoPlayingStatus: Dispatch<SetStateAction<DemoPlayingStatus>>;
  activeArtifact: GetArtifactPayload | null;
}

const Demo = ({
  handleFinishDemo,
  handleSendMessage,
  demoDetails,
  isDemoAvailable,
  demoPlayingStatus,
  setDemoPlayingStatus,
  activeArtifact,
}: IProps) => {
  console.log({ demoDetails });

  const handleStepEnd = () => {
    if (demoDetails?.is_end) {
      handleFinishDemo();
      return;
    }
    handleSendMessage({ message: '', eventType: DemoEvent.DEMO_NEXT, eventData: {} });
  };

  const onBookDemoClick = () => {
    handleSendMessage({ message: '', eventType: DemoEvent.DEMO_NEXT, eventData: {} });
    setDemoPlayingStatus(DemoPlayingStatus.GENRATING_DEMO);
  };

  useEffect(() => {
    if (demoDetails && demoPlayingStatus === DemoPlayingStatus.GENRATING_DEMO) {
      setDemoPlayingStatus(DemoPlayingStatus.PLAYING);
    }
  }, [demoDetails]);

  if (activeArtifact || !isDemoAvailable) {
    return null;
  }
  console.log({ demoPlayingStatus, demoDetails });

  if (demoPlayingStatus === DemoPlayingStatus.INITIAL) {
    return (
      <div className="col-span-2 mr-2 pl-2">
        <div className="flex h-full w-full items-center justify-center">
          <Button onClick={onBookDemoClick}>Show demo</Button>
        </div>
      </div>
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
      />
    </div>
  );
};

export { Demo };
