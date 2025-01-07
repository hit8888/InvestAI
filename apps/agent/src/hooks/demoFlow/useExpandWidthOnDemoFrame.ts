import { useEffect } from 'react';
import { useMessageStore } from '../../stores/useMessageStore';
import { ScriptStepType } from '@meaku/core/types/agent';

const useExpandWidthOnDemoFrame = (demoDetails: ScriptStepType | null) => {
  const setMediaTakeFullScreenWidth = useMessageStore((state) => state.setMediaTakeFullScreenWidth);
  const isMediaTakingFullWidth = useMessageStore((state) => state.isMediaTakingFullWidth);

  useEffect(() => {
    if (demoDetails) {
      if (!isMediaTakingFullWidth) {
        setMediaTakeFullScreenWidth(true);
      }
    }
  }, [demoDetails?.audio_url]);
};

export { useExpandWidthOnDemoFrame };
