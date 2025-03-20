import PopupCloseIcon from '@breakout/design-system/components/icons/popup-close-icon';
import Orb from '@breakout/design-system/components/Orb/index';
import { OrbStatusEnum } from '@meaku/core/types/config';
import { RGB_PRIMARY_COLOR } from '@meaku/core/utils/index';
import { motion } from 'framer-motion';

export type PopupContentProps = {
  agentName: string;
  orgName: string;
  header: string | undefined | null;
  subheader: string | undefined | null;
  handleClosePopup?: () => void;
};

const PopupContent = ({ agentName, orgName, header, subheader, handleClosePopup }: PopupContentProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 20 }}
    transition={{ duration: 0.5 }}
    className="popup-banner-border-gradient-animation absolute -left-24 -top-32 flex items-center justify-center"
    style={{ zIndex: 20 }}
  >
    <div className="popupGradient-container flex p-4" data-testid="greeting-banner">
      <div className="flex items-center gap-4">
        <div className="absolute left-3 top-1/2 z-10 -translate-y-1/2">
          <Orb color={RGB_PRIMARY_COLOR} state={OrbStatusEnum.waiting} />
        </div>
        <div className="flex flex-col items-start gap-1 pl-12">
          <div className="flex w-full justify-between">
            <p className="flex-1 text-lg font-semibold text-white">
              {header ? header : `Hi! I am ${agentName}`} <span className="absolute animate-wave">👋</span>
            </p>
            <button
              className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-foreground/35"
              onClick={handleClosePopup}
            >
              <PopupCloseIcon width={'18'} height={'18'} color="white" />
            </button>
          </div>
          <p className="self-stretch text-sm font-normal text-white">
            {subheader ? subheader : `I am an expert on all things ${orgName}. How can I help you today?`}
          </p>
        </div>
      </div>
    </div>
  </motion.div>
);

export default PopupContent;
