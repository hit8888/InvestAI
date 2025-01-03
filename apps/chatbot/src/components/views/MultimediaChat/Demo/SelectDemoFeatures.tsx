import ArrowRight from '@breakout/design-system/components/icons/ArrowRight';
import Button from '@breakout/design-system/components/layout/button';
import { Checkbox } from '@breakout/design-system/components/Checkbox/index';
import { useState } from 'react';
import { FeatureSelectionDTOType } from '@meaku/core/types/chat';
import { IWebSocketHandleMessage } from '../../../../hooks/useWebSocketChat';
import { DemoEvent } from '@meaku/core/types/webSocket';
import { DemoPlayingStatus } from '@meaku/core/types/common';

interface IProps {
  demoFeatures: FeatureSelectionDTOType[];
  handleSendMessage: (data: IWebSocketHandleMessage) => void;
  setDemoPlayingStatus: (value: DemoPlayingStatus) => void;
}

const SelectDemoFeatures = ({ demoFeatures, handleSendMessage, setDemoPlayingStatus }: IProps) => {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const onBookDemoClick = () => {
    handleSendMessage({ message: '', eventType: DemoEvent.DEMO_NEXT, eventData: { feature_ids: selectedIds } });
    setDemoPlayingStatus(DemoPlayingStatus.GENRATING_DEMO);
  };

  return (
    <div className="col-span-2 mr-2 pl-2">
      <div className="flex h-full w-full items-center justify-center">
        <div className="flex max-w-[50%] flex-col items-center gap-6">
          <div className="flex flex-col items-center gap-8">
            <div className="flex flex-col items-center gap-2">
              <span className="text-2xl font-semibold text-customPrimaryText">Select Features to Explore</span>
              <span className="text-base text-customSecondaryText">
                Choose the features you’d like to learn more about. We’ll tailor the demo to your interests.
              </span>
            </div>
            <div>
              {demoFeatures.map((feature) => (
                <span
                  className="flex h-10 cursor-pointer items-center gap-2 rounded-custom-56 border-2 border-primary px-4 py-2 text-primary/80"
                  key={feature.id}
                  onClick={() => {
                    if (selectedIds.includes(feature.id)) {
                      setSelectedIds(selectedIds.filter((id) => id !== feature.id));
                    } else {
                      setSelectedIds([...selectedIds, feature.id]);
                    }
                  }}
                >
                  <Checkbox checked={!!selectedIds.includes(feature.id)} />
                  {feature.name}
                </span>
              ))}
            </div>
          </div>
          <Button onClick={onBookDemoClick}>
            <div className="flex items-center justify-center gap-2">
              <span>View Topics Demo</span>
              <ArrowRight width={16} height={17} color="white" />
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
};

export { SelectDemoFeatures };
