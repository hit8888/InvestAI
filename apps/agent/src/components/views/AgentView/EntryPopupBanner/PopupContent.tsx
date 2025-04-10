import Button from '@breakout/design-system/components/Button/index';
import PopupCloseIcon from '@breakout/design-system/components/icons/popup-close-icon';
import Orb from '@breakout/design-system/components/Orb/index';
import { cn } from '@breakout/design-system/lib/cn';
import { OrbStatusEnum } from '@meaku/core/types/config';
import { RGB_PRIMARY_COLOR } from '@meaku/core/utils/index';
import { motion } from 'framer-motion';

export type PopupContentProps = {
  agentName: string;
  orgName: string;
  header: string | undefined | null;
  subheader: string | undefined | null;
  handleClosePopup?: () => void;
  popupBannerAlignment: 'left' | 'center' | 'right';
};

const PopupContent = ({
  agentName,
  orgName,
  header,
  subheader,
  handleClosePopup,
  popupBannerAlignment,
}: PopupContentProps) => {
  const isEntryPointOnTheCenterBottom = popupBannerAlignment === 'center';
  const isEntryPointOnTheBottomLeft = popupBannerAlignment === 'left';
  const isEntryPointOnTheBottomRight = popupBannerAlignment === 'right';
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.5 }} // border color is #F2F4F7 in figma
      className={cn(
        'popup-banner-box-shadow absolute flex min-w-[400px] max-w-[500px] items-center justify-center rounded-3xl p-2',
        {
          '-top-36 left-2': isEntryPointOnTheBottomLeft,
          '-left-24 -top-40 extraSmall:-left-4 sm:-left-8 lg:-left-24': isEntryPointOnTheCenterBottom,
          '-top-36 right-0': isEntryPointOnTheBottomRight,
        },
      )}
      style={{ zIndex: 20 }}
    >
      <div
        className="popup-banner-box-shadow flex items-center gap-4 rounded-2xl border-[0.5px] border-gray-200 bg-white/85 p-4"
        data-testid="greeting-banner"
      >
        <div
          className={cn('flex items-start gap-2', {
            'pl-10': isEntryPointOnTheCenterBottom,
          })}
        >
          {isEntryPointOnTheCenterBottom && (
            <div className="absolute left-3 top-1/2 z-10 -translate-y-1/2">
              <Orb
                showThreeStar
                style={{ width: '40px', height: '40px', border: '1px solid #F2F4F7' }}
                color={RGB_PRIMARY_COLOR}
                state={OrbStatusEnum.waiting}
              />
            </div>
          )}
          <div className="flex w-full flex-col justify-between gap-2">
            <p className="flex-1 text-lg font-semibold text-customPrimaryText">
              {header ? header : `Hi! I am ${agentName}`} <span className="absolute animate-wave">👋</span>
            </p>
            <p className="self-stretch text-base text-customSecondaryText">
              {subheader ? subheader : `I am an expert on all things ${orgName}. How can I help you today?`}
            </p>
          </div>
          <Button className="rounded-full bg-[#F2F4F7] p-1" variant="tertiary" onClick={handleClosePopup}>
            <PopupCloseIcon width={'18'} height={'18'} color="#98A2B3" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default PopupContent;
