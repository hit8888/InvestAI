import React from 'react';
import { ChevronDown } from 'lucide-react';

interface ScrollToBottomButtonProps {
  showDownArrow: boolean;
  onScrollToBottom: () => void;
}

export const ScrollToBottomButton: React.FC<ScrollToBottomButtonProps> = ({ showDownArrow, onScrollToBottom }) => {
  if (!showDownArrow) return null;

  return (
    <div className="absolute bottom-4 left-4 z-10">
      <button
        onClick={onScrollToBottom}
        className="flex size-8 animate-bounce items-center justify-center rounded-full bg-background border border-border shadow-lg transition-colors hover:bg-card"
        aria-label="Scroll to bottom"
      >
        <ChevronDown className="h-4 w-4 text-primary" />
      </button>
    </div>
  );
};
