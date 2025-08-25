import React, { useEffect, useState } from 'react';
import { ImageWithFallback, KatyIcon, AvatarComponentProps } from '@meaku/saral';

interface TypingIndicatorProps {
  isLastGroup: boolean;
  hasActiveAdminSession: boolean;
  isAdminTyping: boolean;
  adminSessionInfo?: {
    name: string;
    profilePicture?: string | null;
  } | null;
  selectedAvatar?: {
    Component: React.ComponentType<AvatarComponentProps>;
    name: string;
    index: number;
  } | null;
}

export const TypingIndicator: React.FC<TypingIndicatorProps> = ({
  isLastGroup,
  hasActiveAdminSession,
  isAdminTyping,
  adminSessionInfo,
  selectedAvatar,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  const shouldShow = isLastGroup && hasActiveAdminSession && isAdminTyping;

  useEffect(() => {
    if (shouldShow) {
      setShouldRender(true);
      // Small delay to ensure the element is rendered before animating in
      const timer = setTimeout(() => setIsVisible(true), 10);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
      // Wait for exit animation to complete before unmounting
      const timer = setTimeout(() => setShouldRender(false), 300);
      return () => clearTimeout(timer);
    }
  }, [shouldShow]);

  if (!shouldRender) return null;

  return (
    <div
      className={`pr-3 flex py-2 gap-2 items-center rounded-xl relative text-foreground font-normal text-sm leading-[22px] mr-auto max-w-full transition-all duration-300 ease-in-out ${
        isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-2'
      }`}
    >
      {/* Transparent avatar */}
      {adminSessionInfo?.profilePicture ? (
        <ImageWithFallback
          src={adminSessionInfo.profilePicture}
          alt={adminSessionInfo.name}
          size={28}
          showOnlineIndicator={true}
          className="opacity-50"
        />
      ) : selectedAvatar ? (
        <selectedAvatar.Component className="absolute left-0 top-2 size-7 opacity-50" />
      ) : (
        <KatyIcon className="absolute left-0 top-2 size-7 opacity-50" />
      )}

      {/* Typing indicator content */}
      <div className="flex items-center gap-1 text-xs text-muted-foreground">
        <span>{adminSessionInfo?.name || 'Admin'}</span>
        <span
          className="bg-gradient-to-r from-muted-foreground via-foreground to-muted-foreground bg-clip-text text-transparent bg-[length:200%_100%]"
          style={{
            animation: 'shimmer 1s ease-in-out infinite',
          }}
        >
          {' '}
          is typing...
        </span>
      </div>
    </div>
  );
};
