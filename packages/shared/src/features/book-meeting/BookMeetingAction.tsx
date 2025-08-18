import { Button, Icons } from '@meaku/saral';
import BlackTooltip from '../../components/BlackTooltip';
import { CommandBarModuleTypeSchema } from '@meaku/core/types/api/configuration_response';
import { FeatureActionProps } from '../';
import useFeatureConfig from '../../hooks/useFeatureConfig';

const BookMeetingAction: React.FC<FeatureActionProps> = ({ isActive, onClick }) => {
  const featureConfig = useFeatureConfig(CommandBarModuleTypeSchema.enum.BOOK_MEETING);

  const button = (
    <Button
      data-action-id={`action-${CommandBarModuleTypeSchema.enum.BOOK_MEETING}`}
      size="icon"
      variant={isActive ? 'default_active' : 'outline'}
      onClick={() => onClick?.(featureConfig)}
      className={isActive ? 'rounded-2xl' : 'rounded-full'}
    >
      <Icons.Calendar className="size-5" />
    </Button>
  );

  if (isActive) {
    return button;
  }

  return <BlackTooltip content="Book a call">{button}</BlackTooltip>;
};

export default BookMeetingAction;
