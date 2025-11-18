import * as React from 'react';
import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area';

import { cn } from '../../lib/cn';

type ScrollAreaViewportProps = React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Viewport>;

type ScrollAreaProps = React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root> & {
  viewportProps?: Omit<ScrollAreaViewportProps, 'children'>;
  viewportRef?: React.Ref<HTMLDivElement>;
};

const ScrollArea = React.forwardRef<React.ElementRef<typeof ScrollAreaPrimitive.Root>, ScrollAreaProps>(
  ({ className, children, viewportProps, viewportRef: externalViewportRef, ...props }, ref) => {
    const { className: viewportClassName, style: viewportStyle, ...restViewportProps } = viewportProps ?? {};

    const viewportRef = React.useRef<HTMLDivElement | null>(null);

    const processedChildren = React.useMemo(() => {
      if (!viewportStyle) {
        return children;
      }

      const arrayChildren = React.Children.toArray(children);
      if (arrayChildren.length === 0) {
        return children;
      }

      return arrayChildren.map((child, index) => {
        if (index !== 0 || !React.isValidElement(child)) {
          return child;
        }

        const childElement = child as React.ReactElement<{ style?: React.CSSProperties }>;
        const mergedStyle = { ...(childElement.props.style ?? {}), ...viewportStyle };
        return React.cloneElement(childElement, { style: mergedStyle });
      });
    }, [children, viewportStyle]);

    const assignViewportRef = React.useCallback(
      (node: HTMLDivElement | null) => {
        viewportRef.current = node;

        if (typeof externalViewportRef === 'function') {
          externalViewportRef(node);
        } else if (externalViewportRef) {
          (externalViewportRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }
      },
      [externalViewportRef],
    );

    React.useLayoutEffect(() => {
      const viewportElement = viewportRef.current;
      if (!viewportElement) {
        return;
      }

      const firstChild = viewportElement.firstElementChild as HTMLElement | null;
      if (firstChild) {
        firstChild.style.display = 'block';
      }
    }, [processedChildren]);

    return (
      <ScrollAreaPrimitive.Root ref={ref} className={cn('relative overflow-hidden', className)} {...props}>
        <ScrollAreaPrimitive.Viewport
          ref={assignViewportRef}
          className={cn('h-full w-full rounded-[inherit]', viewportClassName)}
          {...restViewportProps}
        >
          {processedChildren}
        </ScrollAreaPrimitive.Viewport>
        <ScrollBar />
        <ScrollAreaPrimitive.Corner />
      </ScrollAreaPrimitive.Root>
    );
  },
);
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName;

const ScrollBar = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>
>(({ className, orientation = 'vertical', ...props }, ref) => (
  <ScrollAreaPrimitive.ScrollAreaScrollbar
    ref={ref}
    orientation={orientation}
    className={cn(
      'z-20 flex touch-none select-none transition-colors',
      orientation === 'vertical' && 'h-full w-3 p-[3px]',
      orientation === 'horizontal' && 'h-3 w-full flex-col p-[3px]',
      className,
    )}
    {...props}
  >
    <ScrollAreaPrimitive.ScrollAreaThumb className="relative flex-1 rounded-full bg-gray-300 transition-colors hover:bg-gray-400 active:bg-gray-400" />
  </ScrollAreaPrimitive.ScrollAreaScrollbar>
));
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName;

export { ScrollArea, ScrollBar };
