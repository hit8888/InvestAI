import SlidePreviewIcon from '../icons/SlidePreviewIcon';
import VideoPreviewIcon from '../icons/VideoPreviewIcon';
import DemoPreviewIcon from '../icons/DemoPreviewIcon';
import { ArtifactPreviewEnum } from '@meaku/core/types/artifact';

type CommonArtifactPreviewProps = {
  artifactType: keyof typeof ArtifactPreviewEnum;
  title?: string;
  isFetching: boolean;
  handleClick: () => void;
};

const ARTIFACT_CONFIG = {
  SLIDE: {
    header: 'Slide',
    icon: SlidePreviewIcon,
  },
  SLIDE_IMAGE: {
    header: 'Slide',
    icon: SlidePreviewIcon,
  },
  VIDEO: {
    header: 'Video',
    icon: VideoPreviewIcon,
  },
  DEMO: {
    header: 'Demo',
    icon: DemoPreviewIcon,
  },
} as const;

const CommonArtifactPreview = ({ title, isFetching, artifactType, handleClick }: CommonArtifactPreviewProps) => {
  const { header, icon: Icon } = ARTIFACT_CONFIG[artifactType];

  return (
    <div
      tabIndex={0}
      onClick={handleClick}
      className="flex w-full max-w-[424px] cursor-pointer items-center gap-2 rounded-lg border border-gray-300 bg-transparent_gray_3 p-2 pr-4 hover:bg-transparent_gray_6 focus:ring-4 focus:ring-gray-200"
    >
      <div className="flex items-center justify-center rounded-lg bg-transparent_gray_3 p-1">
        <Icon className="text-gray-600" height={18} width={18} />
      </div>
      {isFetching ? (
        <div className="h-10 w-full animate-pulse rounded-lg bg-gray-400" />
      ) : (
        <div className="flex flex-1 items-center gap-2 text-left">
          <p className="text-sm text-gray-400">{`${header}: `}</p>
          {title && (
            <h4
              title={title}
              className="2xl:text-md line-clamp-1 text-sm font-medium text-customPrimaryText lg:text-sm"
            >
              {title}
            </h4>
          )}
        </div>
      )}
    </div>
  );
};

export default CommonArtifactPreview;
