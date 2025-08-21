import React from 'react';
import { Button, ThreeStarInsideOrbIcon, ShiningRectangle } from '@meaku/saral';
import { motion } from 'framer-motion';
import BlackTooltip from '../../components/BlackTooltip';
import { CommandBarModuleTypeSchema } from '@meaku/core/types/api/configuration_response';
import { FeatureActionProps } from '../';
import { useCommandBarStore } from '../../stores/useCommandBarStore';
import useFeatureConfig from '../../hooks/useFeatureConfig';

const MotionWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.div
      initial={{ y: 0 }}
      animate={{ y: [0, -6, 0] }}
      transition={{
        duration: 2.4,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      {children}
    </motion.div>
  );
};

const AskAiAction: React.FC<FeatureActionProps> = ({ isActive, onClick }) => {
  const { config } = useCommandBarStore();
  const featureConfig = useFeatureConfig(CommandBarModuleTypeSchema.enum.ASK_AI);
  const { orb_config: orbConfig } = config.style_config;

  const btnContent = !orbConfig?.show_orb ? (
    <Button
      data-action-id={`action-${CommandBarModuleTypeSchema.enum.ASK_AI}`}
      size="icon"
      onClick={() => onClick?.(featureConfig)}
      className="rounded-full border bg-background hover:bg-background/50 mb-1"
    >
      <img src={orbConfig?.logo_url ?? undefined} alt="orb" className="h-full w-full rounded-full object-cover" />
    </Button>
  ) : (
    <Button
      data-action-id={`action-${CommandBarModuleTypeSchema.enum.ASK_AI}`}
      size="icon"
      onClick={() => onClick?.(featureConfig)}
      className="rounded-full cursor-pointer"
      asChild
    >
      <div className="orb-container relative h-14 w-14 overflow-hidden p-1">
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/50 via-white/10 to-transparent blur-md" />
        <div className="relative inset-0 z-10 flex flex-col items-center justify-center">
          <ShiningRectangle width={25} height={13} />
          <div className="relative -top-1">
            <ThreeStarInsideOrbIcon width={29} height={26} />
          </div>
        </div>
      </div>
    </Button>
  );

  if (isActive) {
    return btnContent;
  }

  return (
    <MotionWrapper>
      <BlackTooltip content="Ask our AI assistant anything!">{btnContent}</BlackTooltip>
    </MotionWrapper>
  );
};

export default AskAiAction;
