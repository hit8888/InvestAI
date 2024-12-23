import last from 'lodash/last';
import { useMessageStore } from '../stores/useMessageStore';
import { useEffect, useState } from 'react';
import { ScriptStepType } from '@meaku/core/types/chat';

const useDemoDetails = () => {
  const messages = useMessageStore((state) => state.messages);
  const setMediaTakeFullScreenWidth = useMessageStore((state) => state.setMediaTakeFullScreenWidth);
  const isMediaTakingFullWidth = useMessageStore((state) => state.isMediaTakingFullWidth);

  const lastMessage = last(messages.filter((message) => message.role === 'ai'));
  const [isDemoAvailable, setIsDemoAvailable] = useState(false);
  const [draftDemoDetails, setDemoDetails] = useState<ScriptStepType | null>(null);
  const demoDetails = lastMessage?.scriptStep;

  const demoAvailable = lastMessage?.demoAvailable ?? false;

  useEffect(() => {
    setIsDemoAvailable(demoAvailable);
  }, [demoAvailable]);

  useEffect(() => {
    if (demoDetails) {
      setDemoDetails(demoDetails);
      if (!isMediaTakingFullWidth) {
        setMediaTakeFullScreenWidth(true);
      }
    }
  }, [demoDetails?.asset_url]);

  return {
    draftDemoDetails,
    isDemoAvailable,
  };
};

export { useDemoDetails };
