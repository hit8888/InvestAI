import { useEffect } from 'react';
import { useDemoDetails } from '../useDemoDetails';
import { useMessageStore } from '../../stores/useMessageStore';

const useExpandWidthOnDemoFrame = () => {
  const { demoDetails } = useDemoDetails();
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
