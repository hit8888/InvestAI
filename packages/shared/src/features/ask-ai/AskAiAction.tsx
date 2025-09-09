import React from 'react';
import { Button, ThreeStarInsideOrbIcon, ShiningRectangle } from '@meaku/saral';
import BlackTooltip from '../../components/BlackTooltip';
import { CommandBarModuleTypeSchema } from '@meaku/core/types/api/configuration_response';
import { FeatureActionProps } from '../';
import useFeatureConfig from '../../hooks/useFeatureConfig';
import { useCommandBarStore } from '../../stores/useCommandBarStore';

const AskAiAction: React.FC<FeatureActionProps> = ({ isActive, onClick, initialTooltip }) => {
  const featureConfig = useFeatureConfig(CommandBarModuleTypeSchema.enum.ASK_AI);
  const { config } = useCommandBarStore();
  const { orb_config: orbConfig } = config.style_config;

  const btnContent = !orbConfig?.show_orb ? (
    <div className="relative group h-14 w-14">
      {/* Disc glow effect behind the button */}
      <div className="absolute inset-0 rounded-full bg-primary/20 scale-0 group-hover:scale-110 transition-transform duration-300 ease-out -z-10" />
      <Button
        data-action-id={`action-${CommandBarModuleTypeSchema.enum.ASK_AI}`}
        size="icon"
        onClick={() => onClick?.(featureConfig)}
        className="rounded-full bg-background hover:bg-background-light relative z-10"
      >
        <img src={orbConfig?.logo_url ?? undefined} alt="orb" className="h-full w-full rounded-full object-cover" />
      </Button>
    </div>
  ) : (
    <div className="relative group h-14 w-14">
      {/* Disc glow effect behind the orb */}
      <div className="absolute inset-0 rounded-full bg-primary/20 scale-0 group-hover:scale-110 transition-transform duration-300 ease-out -z-10" />
      <Button
        data-action-id={`action-${CommandBarModuleTypeSchema.enum.ASK_AI}`}
        size="icon"
        onClick={() => onClick?.(featureConfig)}
        className="rounded-full cursor-pointer relative z-10"
        asChild
      >
        <div className="orb-container relative h-14 w-14 overflow-hidden">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/50 via-white/10 to-transparent blur-md" />
          <div className="relative inset-0 z-10 flex flex-col items-center justify-center">
            <ShiningRectangle width={25} height={13} />
            <div className="relative -top-1">
              <ThreeStarInsideOrbIcon width={29} height={26} />
            </div>
          </div>
        </div>
      </Button>
    </div>
  );

  if (isActive) {
    return btnContent;
  }

  return (
    <BlackTooltip content="Ask our AI assistant anything!" initialTooltip={initialTooltip}>
      {btnContent}
    </BlackTooltip>
  );
};

export default AskAiAction;
