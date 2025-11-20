import { memo, useRef, useState, useEffect, useMemo } from 'react';
import { Check } from 'lucide-react';
import { findFlagUrlByCountryName } from 'country-flags-svg';
import {
  Tooltip,
  TooltipContent,
  TooltipPortal,
  TooltipProvider,
  TooltipTrigger,
} from '@breakout/design-system/components/Tooltip/index';
import { ROUTING_TYPE_LOGO_MAP } from '../../../../utils/constants';

// Country name mappings for flag library compatibility
const COUNTRY_NAME_MAPPING: Record<string, string> = {
  'Russian Federation': 'Russia',
  Czechia: 'Czech Republic',
  'Korea, Republic of': 'South Korea',
  Türkiye: 'Turkey',
};

const normalizeCountryName = (country: string): string => {
  return COUNTRY_NAME_MAPPING[country] || country;
};

// Using centralized logo mapping from constants

// Helper to get initials from full name
const getInitials = (fullName: string): string => {
  const names = fullName.trim().split(' ').filter(Boolean);
  if (names.length === 0) return '?';
  if (names.length === 1) return names[0].charAt(0).toUpperCase();
  return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
};

interface MultiSelectOptionProps {
  option: { value: string; label: string; metadata?: Record<string, unknown> };
  isSelected: boolean;
  isFetching: boolean;
  isLoading: boolean;
  displayType?: string;
  onToggle: (value: string) => void;
}

export const MultiSelectOption = memo(
  ({ option, isSelected, displayType, onToggle }: MultiSelectOptionProps) => {
    const isCountryFlag = displayType === 'country_flag';
    const isUserAvatar = displayType === 'user_avatar';

    // Memoize country flag logic to prevent recalculation on every render
    const { normalizedCountry, flagUrl } = useMemo(() => {
      if (!isCountryFlag) return { normalizedCountry: '', flagUrl: undefined };
      const normalized = normalizeCountryName(option.label);
      const url = findFlagUrlByCountryName(normalized);
      return { normalizedCountry: normalized, flagUrl: url };
    }, [isCountryFlag, option.label]);

    // Track flag image ref and previous URL to prevent unnecessary updates
    const flagImageRef = useRef<HTMLImageElement>(null);
    const prevFlagUrlRef = useRef<string | undefined>(flagUrl);

    // Update image src when flagUrl changes without remounting
    useEffect(() => {
      if (flagImageRef.current) {
        // Only update if URL actually changed
        if (flagUrl && prevFlagUrlRef.current !== flagUrl) {
          // Check if the current src is different to avoid unnecessary reload
          const currentSrc = flagImageRef.current.src;
          const newSrc = flagUrl;

          // Only update if different (accounting for full URL vs relative)
          if (!currentSrc.endsWith(newSrc) && currentSrc !== newSrc) {
            flagImageRef.current.src = flagUrl;
          }
          prevFlagUrlRef.current = flagUrl;
        } else if (!flagUrl) {
          prevFlagUrlRef.current = undefined;
        }
      }
    }, [flagUrl]);

    // User avatar logic
    const avatarUrl = isUserAvatar ? (option.metadata?.avatarUrl as string | undefined) : undefined;
    const fullName = isUserAvatar ? (option.metadata?.fullName as string) || option.label : option.label;
    const routingSource = isUserAvatar ? (option.metadata?.companyLogo as string | undefined) : undefined;
    const companyLogoUrl = routingSource ? ROUTING_TYPE_LOGO_MAP[routingSource] : null;

    const displayText = isUserAvatar ? fullName : option.label;

    // Track image loading errors for user avatar
    const [profilePictureError, setProfilePictureError] = useState(false);
    const [companyLogoError, setCompanyLogoError] = useState(false);

    // Check if text is overflowing
    const textRef = useRef<HTMLSpanElement>(null);
    const [isOverflowing, setIsOverflowing] = useState(false);

    useEffect(() => {
      const checkOverflow = () => {
        if (textRef.current) {
          setIsOverflowing(textRef.current.scrollWidth > textRef.current.clientWidth);
        }
      };

      checkOverflow();
      window.addEventListener('resize', checkOverflow);
      return () => window.removeEventListener('resize', checkOverflow);
    }, [displayText]);

    return (
      <div
        onClick={() => onToggle(option.value)}
        className={`group flex cursor-pointer items-center justify-between gap-3 rounded-md px-3 py-2 transition-colors duration-200 hover:bg-gray-50 ${isSelected ? '!bg-gray-100' : ''}`}
      >
        {/* Custom Checkbox */}
        <div
          className={`rounded-xs border-border flex h-4 w-4 flex-shrink-0 items-center justify-center border transition-all duration-200 ${
            isSelected ? 'border-gray-800 bg-black' : 'bg-background border-gray-200'
          }`}
        >
          {isSelected && <Check className="h-3 w-3 flex-shrink-0 stroke-[3px] text-white" />}
        </div>

        <div className="flex min-w-0 flex-1 items-center gap-3">
          {/* Country flag - always render to prevent remounting */}
          {isCountryFlag && (
            <div className="h-4 w-6 flex-shrink-0">
              <img
                ref={flagImageRef}
                src={flagUrl || ''}
                alt={flagUrl ? `${normalizedCountry} flag` : ''}
                className="h-4 w-6 flex-shrink-0 rounded-sm object-cover shadow-sm"
                loading="lazy"
                decoding="async"
                style={{
                  display: flagUrl ? 'block' : 'none',
                  imageRendering: 'auto',
                  backfaceVisibility: 'hidden',
                  transform: 'translateZ(0)',
                }}
              />
            </div>
          )}

          {/* User avatar with fallback to initials */}
          {isUserAvatar && (
            <>
              {!avatarUrl || profilePictureError ? (
                <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gray-800">
                  <span className="text-[10px] font-semibold text-gray-50">{getInitials(fullName)}</span>
                </div>
              ) : (
                <img
                  src={avatarUrl}
                  alt={fullName}
                  className="h-6 w-6 flex-shrink-0 rounded-full object-cover"
                  onError={() => setProfilePictureError(true)}
                />
              )}
            </>
          )}

          {/* Text with tooltip for overflow */}
          <div className="flex min-w-0 flex-1 items-center gap-2">
            {isOverflowing ? (
              <TooltipProvider delayDuration={300}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span ref={textRef} className="truncate text-sm text-gray-700">
                      {displayText}
                    </span>
                  </TooltipTrigger>
                  <TooltipPortal>
                    <TooltipContent side="top" className="max-w-xs bg-gray-900 text-white">
                      {displayText}
                    </TooltipContent>
                  </TooltipPortal>
                </Tooltip>
              </TooltipProvider>
            ) : (
              <span ref={textRef} className="truncate text-sm text-gray-700">
                {displayText}
              </span>
            )}

            {/* Company/routing logo for user avatar - hide silently if fails */}
            {isUserAvatar && companyLogoUrl && !companyLogoError && (
              <img
                src={companyLogoUrl}
                alt="company"
                className="h-4 w-4 flex-shrink-0 rounded-full"
                onError={() => setCompanyLogoError(true)}
              />
            )}
          </div>
        </div>
      </div>
    );
  },
  (prevProps, nextProps) => {
    // Custom comparison function to prevent unnecessary re-renders
    // Return true if props are equal (skip re-render), false if different (re-render)

    // Quick reference equality check first
    if (
      prevProps.option === nextProps.option &&
      prevProps.isSelected === nextProps.isSelected &&
      prevProps.displayType === nextProps.displayType
    ) {
      return true; // Skip re-render
    }

    // Deep comparison for option object
    if (prevProps.option.value !== nextProps.option.value || prevProps.option.label !== nextProps.option.label) {
      return false; // Re-render needed
    }

    // Compare metadata fields that are actually used
    const prevMeta = prevProps.option.metadata;
    const nextMeta = nextProps.option.metadata;

    if (prevMeta !== nextMeta) {
      // Only re-render if metadata fields we care about changed
      const prevAvatar = prevMeta?.avatarUrl;
      const nextAvatar = nextMeta?.avatarUrl;
      const prevName = prevMeta?.fullName;
      const nextName = nextMeta?.fullName;
      const prevLogo = prevMeta?.companyLogo;
      const nextLogo = nextMeta?.companyLogo;

      if (prevAvatar !== nextAvatar || prevName !== nextName || prevLogo !== nextLogo) {
        return false; // Re-render needed
      }
    }

    // Check other props
    if (prevProps.isSelected !== nextProps.isSelected || prevProps.displayType !== nextProps.displayType) {
      return false; // Re-render needed
    }

    return true; // Skip re-render - all props are effectively equal
  },
);

MultiSelectOption.displayName = 'MultiSelectOption';
