import { cn } from '@breakout/design-system/lib/cn';
import { EntryPointAlignment, EntryPointAlignmentType } from '@meaku/core/types/entryPoint';
import { useUrlParams } from '@meaku/core/hooks/useUrlParams';
import { useMessageStore } from '../stores/useMessageStore';

interface UseEntryPointStylingProps {
  hideBottomBar: boolean;
  shadow_enabled?: boolean;
  entryPointAlignment: EntryPointAlignmentType;
}

export const useEntryPointStyling = ({
  hideBottomBar,
  shadow_enabled,
  entryPointAlignment,
}: UseEntryPointStylingProps) => {
  const hasFirstUserMessageBeenSent = useMessageStore((state) => state.hasFirstUserMessageBeenSent);
  const { getParam } = useUrlParams();
  const isAgentOpen = getParam('isAgentOpen') === 'true';

  const isEntryPointOnTheBottomRight = entryPointAlignment === EntryPointAlignment.RIGHT;
  const isEntryPointOnTheBottomLeft = entryPointAlignment === EntryPointAlignment.LEFT;
  const isEntryPointOnTheBottomCenter = entryPointAlignment === EntryPointAlignment.CENTER;

  const isSideWiseEntryPoint = isEntryPointOnTheBottomRight || isEntryPointOnTheBottomLeft;

  const stylingForParentContainerSidewiseEntryPoint = cn(
    'absolute bottom-4 z-10 flex w-[400px] items-center justify-center p-0.5',
    {
      hidden: hideBottomBar,
      'right-8': isEntryPointOnTheBottomRight,
      'left-8': isEntryPointOnTheBottomLeft,
      'h-20 w-20': !isAgentOpen && hasFirstUserMessageBeenSent,
    },
  );

  const stylingForParentContainerBottomCenterEntryPoint = cn(
    'absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 transform animate-gradient-rotate items-center justify-center rounded-2xl bg-gradient-to-bl from-primary/90 via-transparent to-primary/90 p-0.5',
    {
      'w-[calc(66.66%+110px)]': !hasFirstUserMessageBeenSent,
      'w-[95%]': hasFirstUserMessageBeenSent,
      hidden: hideBottomBar,
      'bottom-bar-shadow': shadow_enabled,
    },
  );

  return {
    isEntryPointOnTheBottomRight,
    isEntryPointOnTheBottomLeft,
    isEntryPointOnTheBottomCenter,
    isSideWiseEntryPoint,
    stylingForParentContainerSidewiseEntryPoint,
    stylingForParentContainerBottomCenterEntryPoint,
    containerStyle: isEntryPointOnTheBottomCenter ? { backgroundSize: '200% 200%' } : {},
  };
};
