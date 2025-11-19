import { useState, useRef, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import { cn } from '@breakout/design-system/lib/cn';

type PanelCardProps = {
  isActive: boolean;
  onClick: () => void;
  className?: string;
  children?: React.ReactNode;
};

const PanelCard = ({ isActive, onClick, className, children }: PanelCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showExpandButton, setShowExpandButton] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only check truncation when collapsed
    if (isExpanded) {
      return;
    }

    const checkIfTruncated = () => {
      if (!contentRef.current) {
        return;
      }

      // Check if content is overflowing by comparing scrollHeight with clientHeight
      // When line-clamp-3 is applied, if scrollHeight > clientHeight, content is truncated
      const element = contentRef.current;
      const isOverflowing = element.scrollHeight > element.clientHeight;

      setShowExpandButton(isOverflowing);
    };

    // Check after a small delay to ensure layout is complete
    const timeoutId = setTimeout(checkIfTruncated, 100);

    // Also check on window resize
    window.addEventListener('resize', checkIfTruncated);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', checkIfTruncated);
    };
  }, [children, isExpanded]);

  const handleShowMoreClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        'flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition-colors hover:bg-gray-25',
        isActive ? 'border-gray-500 shadow-lg' : 'border-gray-200',
        className,
      )}
    >
      {/* Chevron on the left, vertically centered */}
      <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center">
        <ChevronRight
          className={cn(
            'h-6 w-6 transition-all duration-300 ease-in-out',
            isActive ? 'text-gray-900' : 'text-gray-400',
          )}
          style={{
            transform: isActive ? 'scaleX(-1)' : 'scaleX(1)',
            transformOrigin: 'center center',
          }}
        />
      </div>

      {/* Content */}
      {children && (
        <div className={cn('relative flex-1 text-sm', isActive ? 'text-gray-900' : 'text-gray-500')}>
          {/* Visible content */}
          <div className="relative">
            {!isExpanded ? (
              <div className="relative">
                <div ref={contentRef} className="line-clamp-3">
                  {children}
                </div>
                {/* Show more button - positioned at right bottom when ellipsis is shown */}
                {showExpandButton && (
                  <div className="absolute bottom-0 right-0 bg-gradient-to-l from-gray-25 via-gray-25 to-transparent pl-4">
                    <button onClick={handleShowMoreClick} className="text-sm text-primary hover:underline">
                      Show more
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <div>{children}</div>
                {/* Show less button when expanded */}
                {showExpandButton && (
                  <button onClick={handleShowMoreClick} className="mt-2 block text-sm text-primary hover:underline">
                    Show less
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </button>
  );
};

export default PanelCard;
