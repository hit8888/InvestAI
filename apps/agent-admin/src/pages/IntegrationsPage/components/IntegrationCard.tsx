import React from 'react';
import { Switch } from '@breakout/design-system/components/layout/switch';
import salesforceLogo from '../../../assets/salesforce-icon.svg';
import Card from '@breakout/design-system/components/layout/card';
import Typography from '@breakout/design-system/components/Typography/index';
import slackLogo from '../../../assets/slack-icon.svg';
import gmailLogo from '../../../assets/gmail-icon.svg';
import marketoLogo from '../../../assets/marketo-icon.svg';
import attioLogo from '../../../assets/attio-icon.svg';
import hubspotLogo from '../../../assets/hubspot-icon.svg';
import ConnectIcon from '@breakout/design-system/components/icons/connect-icon';
import type { Integration } from '@neuraltrade/core/types/admin/api';
import { getIntegrationNameFromType } from '../../../utils/common';

const integrationIcons: { [key: string]: string } = {
  salesforce: salesforceLogo,
  salesforce_sandbox: salesforceLogo,
  slack: slackLogo,
  gmail: gmailLogo,
  marketo: marketoLogo,
  attio: attioLogo,
  hubspot: hubspotLogo,
};

type IntegrationCardProps = {
  data: Integration;
  onToggle?: (data: Integration) => void;
  disableToggle?: boolean;
};

const IntegrationCard: React.FC<IntegrationCardProps> = ({ data, onToggle, disableToggle }) => {
  const { integration_type: integrationType, integration_group: integrationGroup, description, connected } = data ?? {};
  const icon = integrationIcons[integrationType?.toLowerCase()];
  const name = getIntegrationNameFromType(integrationType);

  if (!integrationType) {
    return null;
  }

  return (
    <Card className="w-[295px] rounded-2xl border border-gray-200 bg-gray-25 shadow-sm">
      <div className="p-4">
        <Typography variant="body-14" textColor="gray500">
          {integrationGroup?.toUpperCase()}
        </Typography>
      </div>
      <div className="mx-4 border-b border-dashed border-gray-200" />
      <div className="space-y-2 p-4">
        <div className="flex items-center space-x-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-gray-100">
            {icon ? <img src={icon} alt={`${name} logo`} className="h-8" /> : <ConnectIcon height={24} width={24} />}
          </div>
          <Typography variant="label-16-semibold" textColor="black">
            {name}
          </Typography>
        </div>
        <Typography variant="body-14" textColor="gray500" className="h-10">
          {description}
        </Typography>
      </div>
      <div className="w-fit p-4">
        <div
          className="flex cursor-pointer items-center space-x-2 rounded-2xl border border-gray-200 bg-gray-100 px-4 py-2"
          onClick={() => onToggle?.(data)}
        >
          <Switch
            id={`integration-${integrationType.toLowerCase()}-toggle-button`}
            disabled={disableToggle}
            checked={connected}
          >
            <ConnectIcon />
          </Switch>
          <Typography variant="label-14-medium" textColor="gray500">
            {connected ? 'Disconnect' : 'Connect'}
          </Typography>
        </div>
      </div>
    </Card>
  );
};

export default IntegrationCard;
