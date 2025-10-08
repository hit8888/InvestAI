import { useShadowRoot } from '@meaku/shared/containers/ShadowRootProvider';
import { useEffect } from 'react';
import { BREAKOUT_ROOT_ID } from '../constants/common';

type UseOutsideClickProps = {
  onOutsideClick: () => void;
};

const useOutsideClick = ({ onOutsideClick }: UseOutsideClickProps) => {
  const { root } = useShadowRoot();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const breakoutRoot = root?.getElementById(BREAKOUT_ROOT_ID) || document.getElementById(BREAKOUT_ROOT_ID);

      const eventPath = event.composedPath();
      const actualTarget = eventPath[0] as Node;
      const isOutsideBreakoutRoot = breakoutRoot && !breakoutRoot.contains(actualTarget);

      if (isOutsideBreakoutRoot) {
        onOutsideClick();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onOutsideClick, root]);
};

export default useOutsideClick;
