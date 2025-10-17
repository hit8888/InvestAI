import { memo, useRef, useState, useEffect } from 'react';
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

export const MultiSelectOption = memo(({ option, isSelected, displayType, onToggle }: MultiSelectOptionProps) => {
  const isCountryFlag = displayType === 'country_flag';
  const isUserAvatar = displayType === 'user_avatar';

  // Country flag logic
  const normalizedCountry = isCountryFlag ? normalizeCountryName(option.label) : '';
  const flagUrl = isCountryFlag ? findFlagUrlByCountryName(normalizedCountry) : undefined;

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
        {/* Country flag */}
        {flagUrl && (
          <img
            src={flagUrl}
            alt={`${normalizedCountry} flag`}
            className="h-4 w-6 flex-shrink-0 rounded-sm object-cover shadow-sm"
          />
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
});

MultiSelectOption.displayName = 'MultiSelectOption';
