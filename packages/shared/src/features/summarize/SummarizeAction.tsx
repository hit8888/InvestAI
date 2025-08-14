import React from 'react';
import { Button, Icons } from '@meaku/saral';
import BlackTooltip from '../../components/BlackTooltip';

interface SummarizeActionProps {
  isActive: boolean;
  onClick: () => void;
  actionId: string;
}

const SummarizeAction: React.FC<SummarizeActionProps> = ({ isActive, onClick, actionId }) => {
  const button = (
    <Button
      data-button-id={`action-${actionId}`}
      size="icon"
      variant={isActive ? 'default_active' : 'outline'}
      onClick={onClick}
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
