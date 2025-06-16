import CommonSlideArtifactContent from './CommonSlideArtifactContent';
import { LucideHourglass } from 'lucide-react';

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
  return (
    <CommonSlideArtifactContent>
      <div className="flex h-full w-full items-center justify-center">
        <LucideHourglass className="h-40 w-40 animate-flip stroke-primary stroke-2" />
      </div>
    </CommonSlideArtifactContent>
  );
};

export default StaticArtifactContainer;
