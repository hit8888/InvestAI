import { cn } from '@breakout/design-system/lib/cn';
import SpinLoader from '@breakout/design-system/components/layout/SpinLoader';
import DemoContent from './DemoContent';
import { useEffect } from 'react';
import { FeatureSelectionDTOType, ScriptStepType } from '@meaku/core/types/agent';

import { DemoPlayingStatus } from '@meaku/core/types/common';
import { SelectDemoFeatures } from './SelectDemoFeatures';

interface IProps {
  handleFinishDemo: () => void;
  demoDetails: ScriptStepType | null;
  demoPlayingStatus: DemoPlayingStatus;
  setDemoPlayingStatus: (value: DemoPlayingStatus) => void;
  demoFeatures: FeatureSelectionDTOType[];
  isDemoAvailable: boolean;
  onStepEnd: () => void;
  switchToDemo: () => void;
}

const Demo = ({
  handleFinishDemo,
  demoDetails,
  demoPlayingStatus,
  setDemoPlayingStatus,
  demoFeatures,
  isDemoAvailable,
  onStepEnd,
  switchToDemo,
}: IProps) => {
  const onFinishDemo = () => {
    handleFinishDemo();
  };
  useEffect(() => {
    if (demoDetails && demoPlayingStatus === DemoPlayingStatus.GENRATING_DEMO) {
      setDemoPlayingStatus(DemoPlayingStatus.PLAYING);
    }
  }, [demoDetails]);

  if (!isDemoAvailable) {
    return null;
  }

  if (demoPlayingStatus === DemoPlayingStatus.STARTED) {
    if (demoFeatures.length > 0) {
      return (
        <SelectDemoFeatures
          demoFeatures={demoFeatures}
          setDemoPlayingStatus={setDemoPlayingStatus}
          switchToDemo={switchToDemo}
        />
      );
    }
    return (
      <div className="col-span-2 mr-2 pl-2">
        <div className="flex h-full w-full items-center justify-center">
          <SpinLoader />
        </div>
      </div>
    );
  }

  if (demoPlayingStatus === DemoPlayingStatus.GENRATING_DEMO) {
    return (
      <div className="col-span-2 mr-2 pl-2">
        <div className="flex h-full w-full items-center justify-center">
          <div className="flex items-center justify-center gap-2">
            <span className="gradient-text">Hold on a moment, we’re preparing your demo!</span>
            <SpinLoader />
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
    <div className={cn('col-span-3 mr-2 overflow-hidden px-8')}>
      <DemoContent
        demoDetails={demoDetails}
        key={demoDetails?.asset_url}
        setDemoPlayingStatus={setDemoPlayingStatus}
        demoPlayingStatus={demoPlayingStatus}
        onStepEnd={onStepEnd}
        onFinishDemo={onFinishDemo}
        switchToDemo={switchToDemo}
      />
    </div>
  );
};

export { Demo };
