import React from 'react';
import { cn, KatyIcon, ImageWithFallback, type AvatarComponentProps } from '@meaku/saral';

export interface AvatarDisplayProps {
  // Admin session data
  adminSessionInfo?: {
    name: string;
    profilePicture?: string | null;
  } | null;

  // Selected avatar
  selectedAvatar?: {
    Component: React.ComponentType<AvatarComponentProps>;
    name: string;
    index: number;
  } | null;

  // Logo/Orb display
  showLogo?: boolean;
  logoUrl?: string | null;
  logoAlt?: string;
  logoSize?: number;

  // Avatar configuration
  size?: number;
  className?: string;

  // Online indicator
  showOnlineIndicator?: boolean;
  onlineIndicatorProps?: OnlineIndicatorProps;

  // Display conditions
  shouldShow?: boolean;

  // Styling variants
  opacity?: number;
  isAbsolute?: boolean;
  position?: 'left-0 top-2' | 'custom';
  customPositionClass?: string;

  // Fallback avatar props
  avatarProps?: Partial<AvatarComponentProps>;

  // Container wrapper
  wrapperClassName?: string;
}

export type OnlineIndicatorProps = {
  position?: 'bottom-right' | 'top-right';
  size?: number;
  borderWidth?: number;
  offset?: number;
};

export const OnlineIndicator: React.FC<OnlineIndicatorProps> = ({
  position = 'bottom-right',
  size = 10,
  borderWidth = 1,
  offset = 2,
}) => {
  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderWidth: `${borderWidth}px`,
        right: `-${offset}px`,
        ...(position === 'bottom-right' ? { bottom: `-${offset}px` } : { top: `-${offset}px` }),
      }}
      className={cn(
        'absolute animate-[quick-flash_3s_ease-in-out_infinite] rounded-full border border-white bg-green-500 z-10',
      )}
    />
  );
};

export const AvatarDisplay: React.FC<AvatarDisplayProps> = ({
  adminSessionInfo,
  selectedAvatar,
  showLogo = false,
  logoUrl,
  logoAlt = 'Logo',
  logoSize = 24,
  size = 28,
  className,
  showOnlineIndicator = false,
  onlineIndicatorProps = {},
  shouldShow = true,
  opacity = 1,
  isAbsolute = false,
  position = 'left-0 top-2',
  customPositionClass,
  avatarProps = {},
  wrapperClassName,
}) => {
  if (!shouldShow) {
    return null;
  }

  const getBaseClassName = () => {
    const baseClasses = [];

    if (isAbsolute) {
      baseClasses.push('absolute');
      if (position === 'custom' && customPositionClass) {
        baseClasses.push(customPositionClass);
      } else if (position !== 'custom') {
        baseClasses.push(position);
      }
    }

    if (opacity !== 1) {
      baseClasses.push(`opacity-${Math.round(opacity * 100)}`);
    }

    return baseClasses.join(' ');
  };

  const renderAvatar = () => {
    const baseClassName = getBaseClassName();

    // Priority 1: Admin profile picture
    if (adminSessionInfo?.profilePicture) {
      return (
        <ImageWithFallback
          src={adminSessionInfo.profilePicture}
          alt={adminSessionInfo.name}
          size={size}
          className={cn(className)}
        />
      );
    }

    // Priority 2: Logo/Orb (if enabled and available)
    if (showLogo && logoUrl) {
      return <ImageWithFallback src={logoUrl} alt={logoAlt} size={logoSize} className={cn(className)} />;
    }

    // Priority 3: Selected avatar
    if (selectedAvatar) {
      const avatarClassName = cn(baseClassName, `w-[${size}px] h-[${size}px]`, className);

      return <selectedAvatar.Component className={avatarClassName} size={size} {...avatarProps} />;
    }

    // Priority 4: Default KatyIcon
    const katyClassName = cn(baseClassName, `w-[${size}px] h-[${size}px]`, className);

    return <KatyIcon className={katyClassName} />;
  };

  const avatar = renderAvatar();

  return (
    <div className={cn('relative', wrapperClassName)}>
      {avatar}
      {showOnlineIndicator && <OnlineIndicator {...onlineIndicatorProps} />}
    </div>
  );
};

// Convenience components for specific use cases
export const MessageAvatar: React.FC<Omit<AvatarDisplayProps, 'size' | 'isAbsolute' | 'position'>> = (props) => (
  <AvatarDisplay {...props} size={28} isAbsolute={true} position="left-0 top-2" />
);

export const HeaderAvatar: React.FC<Omit<AvatarDisplayProps, 'size'>> = (props) => (
  <AvatarDisplay {...props} size={48} />
);

export const TypingAvatar: React.FC<Omit<AvatarDisplayProps, 'size' | 'isAbsolute' | 'position' | 'opacity'>> = (
  props,
) => <AvatarDisplay {...props} size={28} isAbsolute={true} position="left-0 top-2" opacity={0.5} />;
