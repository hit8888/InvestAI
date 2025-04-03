import { EntryPointAlignment, EntryPointAlignmentType } from '@meaku/core/types/entryPoint';
import { useMessageStore } from '../stores/useMessageStore';

interface UseEntryPointStylingProps {
  entryPointAlignment: EntryPointAlignmentType;
}

export const useEntryPointStyling = ({ entryPointAlignment }: UseEntryPointStylingProps) => {
  const hasFirstUserMessageBeenSent = useMessageStore((state) => state.hasFirstUserMessageBeenSent);

  const isEntryPointOnTheBottomRight = entryPointAlignment === EntryPointAlignment.RIGHT;
  const isEntryPointOnTheBottomLeft = entryPointAlignment === EntryPointAlignment.LEFT;
  const isEntryPointOnTheBottomCenter = entryPointAlignment === EntryPointAlignment.CENTER;

  const isSideWiseEntryPoint = isEntryPointOnTheBottomRight || isEntryPointOnTheBottomLeft;

  return {
    isEntryPointOnTheBottomRight,
    isEntryPointOnTheBottomLeft,
    isEntryPointOnTheBottomCenter,
    isSideWiseEntryPoint,
    containerStyle: isEntryPointOnTheBottomCenter
      ? { backgroundSize: '200% 200%', width: hasFirstUserMessageBeenSent ? '410px' : 'calc(66.66% + 110px)' }
      : {},
  };
};
