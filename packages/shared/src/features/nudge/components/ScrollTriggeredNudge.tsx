import { Button, Icons } from '@meaku/saral';
import { motion } from 'framer-motion';
import { Message, MessageEventType } from '../../../types/message';
import { CommandBarModuleType, CommandBarModuleTypeSchema } from '@meaku/core/types/index';
import { useCommandBarStore } from '../../../stores/useCommandBarStore';

const { Calendar, Sparkles } = Icons;

interface ScrollTriggeredNudgeProps {
  setActiveFeature?: (feature: CommandBarModuleType | null) => void;
  sendUserMessage: (message: string, overrides?: Partial<Message>) => void;
  toggleEnabled: () => void;
}

const ScrollTriggeredNudge = ({ setActiveFeature, sendUserMessage, toggleEnabled }: ScrollTriggeredNudgeProps) => {
  const { config } = useCommandBarStore();

  const handleBookMeeting = () => {
    const message = config.body.cta_config?.message ?? '';

    sendUserMessage(message, {
      event_type: MessageEventType.BOOK_MEETING,
    });
    setActiveFeature?.(CommandBarModuleTypeSchema.enum.ASK_AI);
    toggleEnabled();
  };

  const handleSeeItInAction = () => {
    setActiveFeature?.(CommandBarModuleTypeSchema.enum.ASK_AI);
    toggleEnabled();
  };

  return (
    <motion.div
      className="bg-background rounded-xl shadow-elevation-md relative"
      layout="position"
      initial={{ opacity: 0, x: 20, y: 16, scale: 0.98 }}
      animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      transition={{
        duration: 1.0,
        ease: [0.175, 0.885, 0.32, 1.275],
        delay: 0.35,
      }}
    >
      <motion.div
        className="flex gap-4 p-3 overflow-hidden rounded-3xl relative"
        initial={{ clipPath: 'inset(0 0 0 100% round 24px)' }}
        animate={{ clipPath: 'inset(0 0 0 0 round 24px)' }}
        transition={{ duration: 1.0, ease: [0.175, 0.885, 0.32, 1.275] }}
      >
        <Button variant="default" className="w-full" onClick={handleBookMeeting}>
          <Calendar className="size-4" />
          Book a Meeting
        </Button>
        <Button variant="default_active" className="w-full" onClick={handleSeeItInAction}>
          <Sparkles className="size-4" />
          See it in action!
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default ScrollTriggeredNudge;
