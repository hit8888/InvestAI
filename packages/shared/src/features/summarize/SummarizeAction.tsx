import { Button, Icons } from '@meaku/saral';
import BlackTooltip from '../../components/BlackTooltip';
import { CommandBarModuleTypeSchema } from '@meaku/core/types/api/configuration_response';
import { FeatureActionProps } from '../';
import useFeatureConfig from '../../hooks/useFeatureConfig';

const SummarizeAction: React.FC<FeatureActionProps> = ({ isActive, onClick }) => {
  const featureConfig = useFeatureConfig(CommandBarModuleTypeSchema.enum.SUMMARIZE);

  const button = (
    <Button
      data-action-id={`action-${CommandBarModuleTypeSchema.enum.SUMMARIZE}`}
      size="icon"
      variant={isActive ? 'default_active' : 'outline'}
      onClick={() => onClick?.(featureConfig)}
      className={isActive ? 'rounded-2xl' : 'rounded-full'}
    >
      <Icons.FileText className="size-5" />
    </Button>
  );

  if (isActive) {
    return button;
  }

  return <BlackTooltip content="Get a quick summary of any page">{button}</BlackTooltip>;
};

export default SummarizeAction;
