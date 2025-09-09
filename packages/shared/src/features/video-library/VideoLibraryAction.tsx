import { Button, VideoLibraryIcon } from '@meaku/saral';
import BlackTooltip from '../../components/BlackTooltip';
import { CommandBarModuleTypeSchema } from '@meaku/core/types/api/configuration_response';
import { FeatureActionProps } from '../';
import useFeatureConfig from '../../hooks/useFeatureConfig';

const VideoLibraryAction: React.FC<FeatureActionProps> = ({ isActive, onClick, initialTooltip }) => {
  const featureConfig = useFeatureConfig(CommandBarModuleTypeSchema.enum.VIDEO_LIBRARY);

  const button = (
    <Button
      data-action-id={`action-${CommandBarModuleTypeSchema.enum.VIDEO_LIBRARY}`}
      size="icon"
      variant={isActive ? 'default_active' : 'outline'}
      onClick={() => onClick?.(featureConfig)}
      className={isActive ? 'rounded-2xl' : 'rounded-full'}
    >
      <VideoLibraryIcon className="size-5" />
    </Button>
  );

  if (isActive) {
    return button;
  }

  return (
    <BlackTooltip content="Video Library" initialTooltip={initialTooltip}>
      {button}
    </BlackTooltip>
  );
};

export default VideoLibraryAction;
