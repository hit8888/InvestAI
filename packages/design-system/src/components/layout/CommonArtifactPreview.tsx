import SlidePreviewIcon from '../icons/SlidePreviewIcon';
import VideoPreviewIcon from '../icons/VideoPreviewIcon';
import DemoPreviewIcon from '../icons/DemoPreviewIcon';
import { ArtifactPreviewEnum } from '@meaku/core/types/artifact';
import Typography from '../Typography';

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
      className="flex w-full max-w-[424px] cursor-pointer items-center gap-2 rounded-lg border border-gray-300 bg-transparent_gray_3 p-2 pr-4 ring-system hover:bg-transparent_gray_6"
    >
      <div className="flex items-center justify-center rounded-lg bg-transparent_gray_3 p-1">
        <Icon className="text-gray-600" height={18} width={18} />
      </div>
      {isFetching ? (
        <div className="h-10 w-full animate-pulse rounded-lg bg-gray-400" />
      ) : (
        <div className="flex flex-1 items-center gap-2 text-left">
          <Typography variant="body-14" textColor="gray400">{`${header}: `}</Typography>
          {title && (
            <Typography className="2xl:text-md line-clamp-1" variant="label-14-medium" textColor="textPrimary">
              {title}
            </Typography>
          )}
        </div>
      )}
    </div>
  );
};

export default CommonArtifactPreview;
