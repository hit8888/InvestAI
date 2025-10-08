import { useEffect } from 'react';

import { useShadowRoot } from '@meaku/shared/containers/ShadowRootProvider';

type UseOutsideClickProps = {
  onOutsideClick: () => void;
};

const useOutsideClick = ({ onOutsideClick }: UseOutsideClickProps) => {
  const { root: shadowRoot, fallbackRoot } = useShadowRoot();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const breakoutRoot = shadowRoot || fallbackRoot;

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
  }, [onOutsideClick, shadowRoot, fallbackRoot]);
};

export default useOutsideClick;
