import Typography from '@breakout/design-system/components/Typography/index';
import { AgentConfigResponse } from '@meaku/core/types/admin/agent-configs';
import AgentTitleAndSubtitleContent from './AgentTitleAndSubtitleContent';
import { ORB_DESCRIPTION } from '../../utils/constants';
import { Checkbox } from '@breakout/design-system/components/Checkbox/index';
import { useState } from 'react';
import { cn } from '@breakout/design-system/lib/cn';
import Orb from '@breakout/design-system/components/Orb/index';
import { OrbStatusEnum } from '@meaku/core/types/config';
import { handleConfigUpdate } from '../../pages/BrandingPage/utils';
import TooltipWrapperDark from '@breakout/design-system/components/Tooltip/TooltipWrapperDark';

type AgentOrbContainerProps = {
  agentId: number;
  agentConfigs: AgentConfigResponse;
  onUpdate: () => void;
};

const AgentOrbContainer = ({ agentId, agentConfigs, onUpdate }: AgentOrbContainerProps) => {
  const { orb_config, primary } = agentConfigs.configs['agent_personalization:style'];
  const showOrbValue = orb_config ? !orb_config?.show_orb : !!orb_config;
  const shortLogo = orb_config?.logo_url;
  const [useFavicon, setUseFavicon] = useState(showOrbValue || false);

  const useFaviconDisabled = !shortLogo;

  const handleUseFaviconValue = (value: boolean) => {
    setUseFavicon(value);
    handleConfigUpdate(
      agentId,
      {
        configs: {
          'agent_personalization:style': {
            ...agentConfigs?.configs['agent_personalization:style'],
            orb_config: {
              ...agentConfigs?.configs['agent_personalization:style'].orb_config,
              show_orb: !value,
            },
          },
        },
      },
      agentConfigs,
      onUpdate,
      'Use Favicon',
    );
  };

  const getCheckboxElement = () => {
    return (
      <Checkbox
        className={cn('rounded-[2px] bg-white', {
          'border-2 border-gray-400': !useFavicon,
        })}
        disabled={useFaviconDisabled}
        haveBlackBackground={false}
        checked={useFavicon}
        onCheckedChange={handleUseFaviconValue}
      />
    );
  };

  const getTooltipContentElement = () => {
    return (
      <Typography variant={'caption-12-medium'} textColor={'white'}>
        Please upload the Favicon above
      </Typography>
    );
  };

  return (
    <div className="flex w-full flex-col gap-4">
      <Typography variant="title-18">Orb</Typography>
      <div className="flex w-full flex-col gap-6 rounded-2xl border border-gray-200 bg-gray-25 p-6">
        <div className="flex flex-1 items-center gap-6 self-stretch">
          <div className="flex flex-1 flex-col items-start gap-4">
            <AgentTitleAndSubtitleContent subtitle={ORB_DESCRIPTION} />
            <div
              className={cn('flex items-center gap-2 rounded-lg border border-gray-200 p-2 pr-3', {
                'bg-primary/10 text-primary': useFavicon,
                'bg-gray-100': !useFavicon,
              })}
            >
              <TooltipWrapperDark
                showTooltip={useFaviconDisabled}
                trigger={getCheckboxElement()}
                content={getTooltipContentElement()}
                tooltipAlign="start"
              />
              Use favicon.
            </div>
          </div>
          <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-gray-100 bg-white p-3">
            <div className="flex aspect-square h-11 w-11 items-center justify-center rounded-full">
              {useFavicon && !!shortLogo ? (
                <img src={shortLogo} alt="Uploaded logo" className="h-full w-full rounded-full object-fill" />
              ) : (
                <Orb
                  style={{
                    width: '100%',
                    height: '100%',
                  }}
                  color={primary}
                  state={OrbStatusEnum.idle}
                />
              )}
            </div>
            <Typography variant="caption-10-normal" textColor="gray500">
              max 48 x 48
            </Typography>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentOrbContainer;
