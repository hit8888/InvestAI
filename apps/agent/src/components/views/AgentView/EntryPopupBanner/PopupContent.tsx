import { useEffect } from 'react';
import Button from '@breakout/design-system/components/Button/index';
import PopupCloseIcon from '@breakout/design-system/components/icons/popup-close-icon';
import Orb from '@breakout/design-system/components/Orb/index';
import Typography from '@breakout/design-system/components/Typography/index';
import { cn } from '@breakout/design-system/lib/cn';
import { useUrlParams } from '@meaku/core/hooks/useUrlParams';
import { OrbStatusEnum } from '@meaku/core/types/config';
import { RGB_PRIMARY_COLOR } from '@meaku/core/utils/index';
import { motion } from 'framer-motion';
import useSound from '@meaku/core/hooks/useSound';
import popupsound from '../../../../assets/popup-sound.mp4';

export type PopupContentProps = {
  agentName: string;
  orgName: string;
  orbLogoUrl: string | undefined;
  showOrb: boolean;
  header: string | undefined | null;
  subheader: string | undefined | null;
  handleClosePopup?: () => void;
  popupBannerAlignment: 'left' | 'center' | 'right';
};

const PopupContent = ({
  agentName,
  orgName,
  orbLogoUrl,
  showOrb,
  header,
  subheader,
  handleClosePopup,
  popupBannerAlignment,
}: PopupContentProps) => {
  const isEntryPointOnTheCenterBottom = popupBannerAlignment === 'center';
  const isEntryPointOnTheBottomLeft = popupBannerAlignment === 'left';
  const isEntryPointOnTheBottomRight = popupBannerAlignment === 'right';

  const { play } = useSound(popupsound, 0.35);

  useEffect(() => {
    play();
  }, [play]);

  const { setAgentOpen } = useUrlParams();
  const handleBannerClose = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    handleClosePopup?.();
  };

  return (
    <motion.div
      onClick={setAgentOpen}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.5 }} // border color is #F2F4F7 in figma
      className={cn(
        'popup-banner-box-shadow absolute flex min-w-[400px] max-w-[500px] cursor-pointer items-center justify-center rounded-3xl p-2',
        {
          'bottom-32 left-12': isEntryPointOnTheBottomLeft,
          'bottom-28 sm:left-8 md:left-12 lg:left-32': isEntryPointOnTheCenterBottom,
          'bottom-32 right-8': isEntryPointOnTheBottomRight,
        },
      )}
      style={{ zIndex: 20 }}
    >
      <div
        className="popup-banner-box-shadow flex w-full items-center gap-4 rounded-2xl border-[0.5px] border-gray-200 bg-white/85 p-4"
        data-testid="greeting-banner"
      >
        <div
          className={cn('flex w-full items-start justify-center gap-2', {
            'pl-12': isEntryPointOnTheCenterBottom,
          })}
        >
          {isEntryPointOnTheCenterBottom && (
            <div className="absolute left-3 top-1/2 z-10 -translate-y-1/2">
              <Orb
                style={{ width: '40px', height: '40px', border: '1px solid #F2F4F7' }}
                color={RGB_PRIMARY_COLOR}
                state={OrbStatusEnum.waiting}
                orbLogoUrl={orbLogoUrl}
                showOrb={showOrb}
              />
            </div>
          )}
          <div className="flex w-full flex-col items-start justify-center gap-1">
            <Typography className="flex-1" variant="title-18" textColor="textPrimary">
              {header ? header : `Hi! I am ${agentName}`} <span className="absolute animate-wave">👋</span>
            </Typography>
            <Typography className="self-stretch" variant="body-16" textColor="textSecondary">
              {subheader ? subheader : `I am an expert on all things ${orgName}. How can I help you today?`}
            </Typography>
          </div>
          <Button className="rounded-full bg-[#F2F4F7] p-1" variant="tertiary" onClick={handleBannerClose}>
            <PopupCloseIcon width={'18'} height={'18'} color="#98A2B3" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default PopupContent;
