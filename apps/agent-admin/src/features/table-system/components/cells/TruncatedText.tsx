import { useRef, useEffect, useState } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@breakout/design-system/components/Tooltip/index';

interface TruncatedTextProps {
  /** Text content to display */
  text: string;
  /** Maximum width before truncation */
  maxWidth?: string;
  /** Additional CSS classes */
  className?: string;
  /** Tooltip side preference */
  tooltipSide?: 'top' | 'bottom' | 'left' | 'right';
  /** Tooltip delay in milliseconds */
  tooltipDelay?: number;
  /** Custom tooltip content - when provided, overrides the default text tooltip */
  customTooltip?: string;
}

/**
 * TruncatedText - A utility component that shows tooltip only when text is actually truncated
 *
 * This component:
 * - Limits text to a specified max-width
 * - Detects if truncation is happening
 * - Shows tooltip with full text only when truncated
 * - Uses proper Tooltip component for consistency
 */
export const TruncatedText = ({
  text,
  maxWidth = '200px',
  className = '',
  tooltipSide = 'top',
  tooltipDelay = 200,
  customTooltip,
}: TruncatedTextProps) => {
  const textRef = useRef<HTMLDivElement>(null);
  const [isTruncated, setIsTruncated] = useState(false);

  useEffect(() => {
    const checkTruncation = () => {
      if (textRef.current) {
        const element = textRef.current;
        // Check if the element's scrollWidth is greater than its clientWidth
        setIsTruncated(element.scrollWidth > element.clientWidth);
      }
    };

    checkTruncation();

    // Listen for resize events to recheck truncation
    const resizeObserver = new ResizeObserver(checkTruncation);
    if (textRef.current) {
      resizeObserver.observe(textRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [text]);

  // Early return for empty text - after all hooks
  if (!text || text.trim() === '') {
    return <span className="text-gray-400">-</span>;
  }

  const textElement = (
    <div
      ref={textRef}
      className={`cursor-default truncate text-sm font-normal text-gray-900 ${className}`}
      style={{ maxWidth }}
    >
      {text}
    </div>
  );

  // Show tooltip if text is truncated OR if custom tooltip is provided
  const shouldShowTooltip = isTruncated || customTooltip;

  if (shouldShowTooltip) {
    return (
      <TooltipProvider>
        <Tooltip delayDuration={tooltipDelay}>
          <TooltipTrigger asChild>{textElement}</TooltipTrigger>
          <TooltipContent side={tooltipSide} className="bg-gray-900 text-white">
            {customTooltip || text}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  // Return plain element if no tooltip needed
  return textElement;
};
