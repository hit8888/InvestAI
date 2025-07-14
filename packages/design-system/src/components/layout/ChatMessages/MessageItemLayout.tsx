import { cn } from '@breakout/design-system/lib/cn';
import React from 'react';
import { useIsMobile } from '@meaku/core/contexts/DeviceManagerProvider';

// Defined proper enums for better type safety and IntelliSense
export enum Alignment {
  LEFT = 'left',
  RIGHT = 'right',
  CENTER = 'center',
}

export enum Gap {
  SMALL = 'small',
  MEDIUM = 'medium',
}

export enum Padding {
  NONE = 'none',
  INLINE = 'inline',
  INLINE_LEFT_ONLY = 'inline-left-only',
}

export enum Orientation {
  ROW = 'row',
  COLUMN = 'column',
}

interface MessageItemLayoutProps {
  children: React.ReactNode;
  className?: string;
  elementRef?: React.RefObject<HTMLDivElement | null>;
  align?: Alignment;
  gap?: Gap;
  paddingInline?: Padding;
  orientation?: Orientation;
}

const MessageItemLayout = ({
  children,
  className,
  elementRef,
  align,
  gap,
  paddingInline,
  orientation,
}: MessageItemLayoutProps) => {
  const isMobile = useIsMobile();
  const finalAlign = align || Alignment.LEFT;
  const finalGap = gap || Gap.SMALL;
  const finalPaddingInline = isMobile ? Padding.NONE : paddingInline || Padding.NONE;
  const finalOrientation = orientation || Orientation.ROW;

  const alignmentClasses = {
    [Alignment.LEFT]: finalOrientation === Orientation.COLUMN ? 'items-start' : 'justify-start',
    [Alignment.RIGHT]: finalOrientation === Orientation.COLUMN ? 'items-end' : 'justify-end',
    [Alignment.CENTER]: 'justify-center',
  };

  const paddingClasses = {
    [Padding.NONE]: 'pl-0',
    [Padding.INLINE_LEFT_ONLY]: 'pl-11',
    [Padding.INLINE]: 'pl-11 pr-6', // Inline padding is used for messages that are not the last message in the conversation
  };

  const gapClasses = {
    [Gap.SMALL]: 'gap-2',
    [Gap.MEDIUM]: 'gap-4',
  };

  const orientationClasses = {
    [Orientation.ROW]: 'flex-row',
    [Orientation.COLUMN]: 'flex-col',
  };

  return (
    <div
      className={cn(
        'flex',
        alignmentClasses[finalAlign],
        orientationClasses[finalOrientation],
        paddingClasses[finalPaddingInline],
        finalGap && gapClasses[finalGap],
        className,
      )}
      ref={elementRef}
    >
      {children}
    </div>
  );
};

export default MessageItemLayout;
