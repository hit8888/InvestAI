import React from 'react';
import { Button, Icons } from '@meaku/saral';
import { CommandBarModuleConfigType } from '@meaku/core/types/api/configuration_response';
import BlackTooltip from '../../components/BlackTooltip';

interface IframeActionProps {
  config: CommandBarModuleConfigType;
  isActive: boolean;
  onClick: () => void;
  actionId: string;
}

const IframeAction: React.FC<IframeActionProps> = ({ config, isActive, onClick, actionId }) => {
  if (!config.module_configs.url) {
    return null;
  }

  const button = (
    <Button
      data-button-id={`action-${actionId}`}
      size="icon"
      variant={isActive ? 'default_active' : 'outline'}
      onClick={onClick}
      className={isActive ? 'rounded-2xl' : 'rounded-full'}
    >
      <Icons.Code className="size-5" />
    </Button>
  );

  if (isActive) {
    return button;
  }

  return <BlackTooltip content={config.tooltip_text ?? config.name}>{button}</BlackTooltip>;
};

export default IframeAction;
