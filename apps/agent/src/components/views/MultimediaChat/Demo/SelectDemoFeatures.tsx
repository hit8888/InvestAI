import ArrowRight from '@breakout/design-system/components/icons/ArrowRight';
import Button from '@breakout/design-system/components/layout/button';
import { Checkbox } from '@breakout/design-system/components/Checkbox/index';
import { useState } from 'react';
import { FeatureSelectionDTOType } from '@meaku/core/types/agent';
import { DemoPlayingStatus } from '@meaku/core/types/common';
import useAgentbotAnalytics from '@meaku/core/hooks/useAgentbotAnalytics';
import ANALYTICS_EVENT_NAMES from '@meaku/core/constants/analytics';
import useSelectedFeatureStore from '../../../../stores/useSelectedFeatureStore';
import toast from 'react-hot-toast';
import { cn } from '@breakout/design-system/lib/cn';

interface IProps {
  demoFeatures: FeatureSelectionDTOType[];
  setDemoPlayingStatus: (value: DemoPlayingStatus) => void;
  switchToDemo: ({ feature_ids }: { feature_ids: number[] }) => void;
}

const SelectDemoFeatures = ({ demoFeatures, switchToDemo, setDemoPlayingStatus }: IProps) => {
  const { setFeatures, setFirstSlideInDemoFlow } = useSelectedFeatureStore();
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const { trackAgentbotEvent } = useAgentbotAnalytics();

  const onBookDemoClick = () => {
    if (selectedIds.length) {
      const selectedFeatures = demoFeatures.filter((item) => selectedIds.includes(item.id));
      setFeatures(selectedFeatures);
      switchToDemo({ feature_ids: selectedIds });
      trackAgentbotEvent(ANALYTICS_EVENT_NAMES.SELECT_TOPIC, { feature_ids: selectedIds });
      setDemoPlayingStatus(DemoPlayingStatus.GENRATING_DEMO);
      setFirstSlideInDemoFlow(true);
    } else {
      return toast.error('Please Select atleast one feature', {
        duration: 1000,
      });
    }
  };

  const handleFeaturesClick = (feature: FeatureSelectionDTOType) => {
    if (selectedIds.includes(feature.id)) {
      setSelectedIds(selectedIds.filter((id) => id !== feature.id));
    } else {
      setSelectedIds([...selectedIds, feature.id]);
    }
  };

  return (
    <div className="col-span-2 mr-2 pl-2">
      <div className="flex h-full w-full items-center justify-center">
        <div className="flex max-w-[50%] flex-col items-center gap-6">
          <div className="flex flex-col items-center gap-8">
            <div className="flex flex-col items-center gap-2">
              <span className="text-center text-2xl font-semibold text-customPrimaryText">
                Select the features that you would like to see in the demo
              </span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {demoFeatures.map((feature) => (
                <span
                  className={cn(
                    'flex h-10 cursor-pointer items-center gap-2 rounded-custom-56 border-2 border-primary px-4 py-2 text-customSecondaryText',
                    {
                      'bg-primary text-white': selectedIds.includes(feature.id),
                      'hover:bg-primary/10': !selectedIds.includes(feature.id),
                    },
                  )}
                  key={feature.id}
                  onClick={() => handleFeaturesClick(feature)}
                >
                  <Checkbox isCircularCheckbox={true} checked={!!selectedIds.includes(feature.id)} />
                  {feature.name}
                </span>
              ))}
            </div>
          </div>
          <Button onClick={onBookDemoClick}>
            <div className="flex items-center justify-center gap-2">
              <span>Start Demo</span>
              <ArrowRight width={16} height={17} color="white" />
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
};

export { SelectDemoFeatures };
