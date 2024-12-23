import { cn } from '@breakout/design-system/lib/cn';
import { IWebSocketHandleMessage } from '../../../../hooks/useWebSocketChat';
import { DemoEvent } from '@meaku/core/types/webSocket';
import DemoContent from './DemoContent';
import { useState } from 'react';
import { ScriptStepType } from '@meaku/core/types/chat';
import Button from '@breakout/design-system/components/layout/button';

interface IProps {
  handleFinishDemo: () => void;
  handleSendMessage: (data: IWebSocketHandleMessage) => void;
  demoDetails: ScriptStepType | null;
  isDemoAvailable: boolean;
}

const Demo = ({ handleFinishDemo, handleSendMessage, demoDetails, isDemoAvailable }: IProps) => {
  const [isDemoPlaying, setIsDemoPlaying] = useState<boolean>(false);
  const handleGetNextDemoFrame = () => {
    handleSendMessage({ message: '', eventType: DemoEvent.DEMO_NEXT, eventData: {} });
  };

  const handleOnDemoFinish = () => {
    handleFinishDemo();
    setIsDemoPlaying(false);
  };

  if (!isDemoAvailable) {
    return null;
  }

  if (!demoDetails) {
    return (
      <div className="col-span-2 flex h-full w-full items-center justify-center">
        <Button onClick={handleGetNextDemoFrame}>Book demo</Button>
      </div>
    );
  }

  return (
    <div className={cn('col-span-3 mr-2 overflow-hidden pl-2')}>
      <DemoContent
        demoDetails={demoDetails}
        key={demoDetails?.asset_url}
        onDemoFinish={handleOnDemoFinish}
        setIsDemoPlaying={setIsDemoPlaying}
        isDemoPlaying={isDemoPlaying}
        handleGetNextDemoFrame={handleGetNextDemoFrame}
      />
    </div>
  );
};

export { Demo };
