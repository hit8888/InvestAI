import { motion } from 'framer-motion';
import SendSchedule from '@breakout/design-system/components/icons/SendSchedule';
import Typography from '@breakout/design-system/components/Typography/index';

interface NotificationProps {
  variant?: 'default' | 'success';
}

export const WaitDemoCompleteNotification = ({ variant = 'default' }: NotificationProps) => {
  const variants = {
    hidden: {
      opacity: 0,
      y: 20,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: 'easeOut',
      },
    },
  };

  const bgColor =
    variant === 'success'
      ? 'bg-[rgba(22,163,74,0.60)]' // Green background
      : 'bg-[rgba(16,24,40,0.60)]'; // Default dark background

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={variants}
      className={`flex items-center gap-2 rounded-lg ${bgColor} p-2 shadow-lg`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <SendSchedule height={24} width={24} color="white" className="animate-pulse" />
      <Typography as="div" variant="label-14-medium" textColor="white">
        {variant === 'success'
          ? 'Go ahead, I am listening!'
          : "You'll have the chance to ask your question after Sam finishes."}
      </Typography>
    </motion.div>
  );
};
