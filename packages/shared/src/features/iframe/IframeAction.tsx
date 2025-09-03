import { Button, Icons } from '@meaku/saral';
import BlackTooltip from '../../components/BlackTooltip';
import { CommandBarModuleTypeSchema } from '@meaku/core/types/api/configuration_response';
import { FeatureActionProps } from '../';
import useFeatureConfig from '../../hooks/useFeatureConfig';

const IframeAction: React.FC<FeatureActionProps> = ({ isActive, onClick }) => {
  const featureConfig = useFeatureConfig(CommandBarModuleTypeSchema.enum.IFRAME);

  if (!featureConfig?.module_configs?.url) {
    return null;
  }

  const button = (
    <Button
      data-action-id={`action-${CommandBarModuleTypeSchema.enum.IFRAME}`}
      size="icon"
      variant={isActive ? 'default_active' : 'outline'}
      onClick={() => onClick?.(featureConfig)}
      className={isActive ? 'rounded-2xl' : 'rounded-full'}
    >
      <Icons.Gamepad2 className="size-5" />
    </Button>
  );

  if (isActive) {
    return button;
  }

  return (
    <BlackTooltip content={featureConfig.module_configs.tooltip_text ?? featureConfig.name}>{button}</BlackTooltip>
  );
};

export default IframeAction;
