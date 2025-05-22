import { useRef, useState, useEffect } from 'react';

interface UseTextTruncationProps {
  text: string;
  maxWidth?: number;
}

export const useTextTruncation = ({ text, maxWidth }: UseTextTruncationProps) => {
  const textRef = useRef<HTMLParagraphElement>(null);
  const [isTextTruncated, setIsTextTruncated] = useState(false);

  useEffect(() => {
    const checkTruncation = () => {
      if (textRef.current) {
        const element = textRef.current;

        // Create a temporary span to measure the full text width
        const tempSpan = document.createElement('span');
        tempSpan.style.visibility = 'hidden';
        tempSpan.style.position = 'absolute';
        tempSpan.style.whiteSpace = 'nowrap';
        tempSpan.style.font = window.getComputedStyle(element).font;
        tempSpan.textContent = text;
        document.body.appendChild(tempSpan);

        // Get the full text width
        const fullTextWidth = tempSpan.offsetWidth;
        document.body.removeChild(tempSpan);

        // Get the available width in the container
        const containerWidth = element.offsetWidth;

        // Check if text would overflow
        const wouldOverflow = fullTextWidth > containerWidth;

        // Check if text is actually truncated (has ellipsis)
        const isTruncated = element.offsetHeight < element.scrollHeight || element.offsetWidth < element.scrollWidth;

        // Only show tooltip if text would overflow AND is actually truncated
        setIsTextTruncated(wouldOverflow && isTruncated);
      }
    };

    // Initial check
    checkTruncation();

    // Add resize observer to check on window resize
    const resizeObserver = new ResizeObserver(checkTruncation);
    if (textRef.current) {
      resizeObserver.observe(textRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [text, maxWidth]);

  return {
    textRef,
    isTextTruncated,
  };
};
