import { useEffect, useState } from 'react';

const useShowNudgeBody = (nudgeVisible: boolean, headerPresent: boolean) => {
  const [mountBody, setMountBody] = useState<boolean>(!headerPresent);

  useEffect(() => {
    if (!nudgeVisible) {
      setMountBody(false);
      return;
    }

    if (headerPresent) {
      setMountBody(false);
      const timerId = setTimeout(() => setMountBody(true), 900);
      return () => clearTimeout(timerId);
    }
    setMountBody(true);
  }, [nudgeVisible, headerPresent]);

  return mountBody;
};

export default useShowNudgeBody;
