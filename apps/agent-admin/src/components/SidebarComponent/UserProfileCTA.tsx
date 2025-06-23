import { motion, AnimatePresence } from 'framer-motion';
import ProfilePicActionButton from '../ProfilePicActionButton';
import { useAuth } from '../../context/AuthProvider';
import { DEFAULT_USERNAME, SIDEBAR_TEXTUAL_CONTENT_ANIMATION_PROPS } from '../../utils/constants';
import { getProfileCTAInnerContainerAnimation, getTransitionAnimation } from '../../utils/common';

const UserProfileCTA = ({ isOpen }: { isOpen: boolean }) => {
  const { userInfo } = useAuth();
  const userName = userInfo?.username || DEFAULT_USERNAME;
  return (
    <div className="flex flex-col items-start justify-center gap-2 self-stretch rounded-2xl p-2">
      <motion.div className="flex items-center gap-2 self-stretch" {...getTransitionAnimation()}>
        <motion.div
          className="flex flex-1 items-center gap-3 border border-primary/20 bg-primary/5 p-2"
          {...getProfileCTAInnerContainerAnimation(isOpen)}
        >
          <ProfilePicActionButton />
          <AnimatePresence>
            {isOpen ? (
              <motion.div
                {...SIDEBAR_TEXTUAL_CONTENT_ANIMATION_PROPS}
                className="flex w-full flex-col items-start justify-center gap-0.5"
              >
                <p className="w-[80%] self-stretch text-sm font-semibold capitalize text-primary">{userName}</p>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default UserProfileCTA;
