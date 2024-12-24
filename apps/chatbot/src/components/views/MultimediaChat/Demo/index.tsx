import { cn } from '@breakout/design-system/lib/cn';
import { IWebSocketHandleMessage } from '../../../../hooks/useWebSocketChat';
import { DemoEvent } from '@meaku/core/types/webSocket';
import DemoContent from './DemoContent';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
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
  const [isGeneratingDemo, setIsGeneratingDemo] = useState<boolean>(false);
  const isFirstStep = !demoDetails && isDemoAvailable; //case when BE just sends demo_available and no demo_details.FE sends back DEMO_NEXT to get the subsequent step

  const handleStepEnd = () => {
    if (demoDetails?.is_end) {
      handleFinishDemo();
      return;
    }
    handleSendMessage({ message: '', eventType: DemoEvent.DEMO_NEXT, eventData: {} });
  };

  const onBookDemoClick = () => {
    setIsGeneratingDemo(true);
    handleSendMessage({ message: '', eventType: DemoEvent.DEMO_NEXT, eventData: {} });
  };

  useEffect(() => {
    if (demoDetails && isGeneratingDemo) {
      setIsGeneratingDemo(false);
    }
  }, [demoDetails]);

  if (activeArtifact) {
    return null;
  }

  if (isFirstStep || demoPlayingStatus === DemoPlayingStatus.FINISHED) {
    return (
      <div className="col-span-2 mr-2 pl-2">
        <div className="flex h-full w-full items-center justify-center">
          {isGeneratingDemo ? (
            <div className="flex items-center justify-center gap-2">
              <span className="text-primary">Hold on. Creating demo</span>
              <div className=" animate-spin ">
                <Loader color="rgb(var(--primary)" />
              </div>
            </div>
          ) : (
            <Button onClick={onBookDemoClick}>Show demo</Button>
          )}
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
