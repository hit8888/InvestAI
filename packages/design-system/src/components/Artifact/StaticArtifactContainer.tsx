import { useCycle } from '../../hooks/useCycle';
import SlideSubTitle from '../layout/SlideSubTitle';
import CommonSlideArtifactContent from './CommonSlideArtifactContent';

const STATIC_LABEL_CONTENT_INTERVAL_DURATION_IN_MS = 2000;
const STATIC_LABEL_CONTENT = [
  `I'll surface relevant visuals here, in real time.`,
  `Slides, videos, and demo will load here.`,
  `Getting things ready...`,
];

const StaticArtifactContainer = () => {
  return (
    <div className="w-[66%] pl-2 pr-4 pt-4">
      <div className="flex h-full max-h-full w-full items-center justify-center rounded-[10px] border border-gray-200 bg-transparent_gray_3 p-2">
        <div className="group relative flex h-full w-full items-center justify-center overflow-hidden rounded-lg">
          <NudgeArtifactContent />
        </div>
      </div>
    </div>
  );
};

const NudgeArtifactContent = () => {
  const { currentItemIndex } = useCycle({
    itemsLength: STATIC_LABEL_CONTENT.length,
    intervalDuration: STATIC_LABEL_CONTENT_INTERVAL_DURATION_IN_MS,
  });
  return (
    <CommonSlideArtifactContent>
      <div className="flex h-full w-full items-center justify-start pl-8">
        <SlideSubTitle className="w-full" text={STATIC_LABEL_CONTENT[currentItemIndex]} />
      </div>
    </CommonSlideArtifactContent>
  );
};

export default StaticArtifactContainer;
