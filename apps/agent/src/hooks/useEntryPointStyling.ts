import { EntryPointAlignment, EntryPointAlignmentType } from '@meaku/core/types/entryPoint';
import { useMessageStore } from '../stores/useMessageStore';

interface UseEntryPointStylingProps {
  entryPointAlignment: EntryPointAlignmentType;
  isMobile: boolean;
}

export const useEntryPointStyling = ({ entryPointAlignment, isMobile }: UseEntryPointStylingProps) => {
  const hasFirstUserMessageBeenSent = useMessageStore((state) => state.hasFirstUserMessageBeenSent);

  const isEntryPointOnTheBottomRight = entryPointAlignment === EntryPointAlignment.RIGHT;
  const isEntryPointOnTheBottomLeft = entryPointAlignment === EntryPointAlignment.LEFT;
  const isEntryPointOnTheBottomCenter = entryPointAlignment === EntryPointAlignment.CENTER;

  const isSideWiseEntryPoint = isEntryPointOnTheBottomRight || isEntryPointOnTheBottomLeft;

  const getWidth = () => {
    if (hasFirstUserMessageBeenSent) {
      if (isMobile) return '90vw';
      return '410px';
    }
    if (isMobile) return '90vw';
    return 'calc(66.66% + 110px)';
  };

  return {
    isEntryPointOnTheBottomRight,
    isEntryPointOnTheBottomLeft,
    isEntryPointOnTheBottomCenter,
    isSideWiseEntryPoint,
    containerStyle: isEntryPointOnTheBottomCenter
      ? {
          backgroundSize: '200% 200%',
          width: getWidth(),
        }
      : {},
  };
};
