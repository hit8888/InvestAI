import TooltipWrapperDark from '@breakout/design-system/components/Tooltip/TooltipWrapperDark';
import { useTextTruncation } from '@breakout/design-system/hooks/useTextTruncation';
import { cn } from '@breakout/design-system/lib/cn';
import { LocationWithCityCountry } from '@meaku/core/types/admin/admin';
import { findFlagUrlByCountryName } from 'country-flags-svg';

// Country name mappings for flag library compatibility
const COUNTRY_NAME_MAPPING = {
  'Russian Federation': 'Russia',
  Czechia: 'Czech Republic',
  'Korea, Republic of': 'South Korea',
  Türkiye: 'Turkey',
} as const;

// Countries without available flags in the library
const COUNTRIES_WITHOUT_FLAGS = [
  'Bolivia',
  'Democratic Republic of the Congo',
  'Holy See',
  'Ireland',
  'Palestine',
  'Réunion',
  'Sao Tome and Principe',
  'Syria',
] as const;

interface LocationCellValueProps {
  value: string | LocationWithCityCountry;
  showTruncatedText?: boolean;
  isValueOrientationRight?: boolean;
  showTooltip?: boolean;
}

interface LocationData {
  city: string;
  country: string;
  normalizedCountry: string;
  flagUrl?: string;
  hasFlag: boolean;
  isMultipleLocations: boolean;
}

// Utility functions
const getCountryNameMapping = (country: string): string => {
  return COUNTRY_NAME_MAPPING[country as keyof typeof COUNTRY_NAME_MAPPING];
};

const normalizeCountryName = (country: string): string => {
  const countryNameMapping = getCountryNameMapping(country);
  if (countryNameMapping) {
    return countryNameMapping;
  }

  if (country?.includes(',')) {
    return country.split(',')[0].trim();
  }

  return country;
};

const extractLocationData = (value: string | LocationWithCityCountry): LocationData => {
  const isObjectValue = typeof value === 'object';
  const city = isObjectValue ? value.city : '';
  const country = isObjectValue ? value.country : value;
  const normalizedCountry = normalizeCountryName(country);

  const flagUrl = country ? findFlagUrlByCountryName(normalizedCountry) : undefined;
  // This line determines if we should show a flag for this country by:
  // 1. Checking if we found a flag URL for the country (flagUrl exists)
  // 2. AND checking that the country is not in our COUNTRIES_WITHOUT_FLAGS list
  // The type cast ensures normalizedCountry matches the tuple type of COUNTRIES_WITHOUT_FLAGS
  const hasFlag = Boolean(
    flagUrl && !COUNTRIES_WITHOUT_FLAGS.includes(normalizedCountry as (typeof COUNTRIES_WITHOUT_FLAGS)[number]),
  );
  const isMultipleLocations = !getCountryNameMapping(country) && country?.includes(',');

  return {
    city,
    country,
    normalizedCountry,
    flagUrl,
    hasFlag,
    isMultipleLocations,
  };
};

const buildLocationParts = (locationData: LocationData): string[] => {
  const { city, normalizedCountry } = locationData;

  return [city && city !== '-' ? city : undefined, normalizedCountry ? normalizedCountry : undefined].filter(
    (part): part is string => Boolean(part),
  );
};

// Component sub-components
const LocationFlag = ({ flagUrl, country }: { flagUrl: string; country: string }) => (
  <img src={flagUrl} width={20} height={20} alt={`${country} flag-icon`} />
);

const TooltipContent = ({ locationData }: { locationData: LocationData }) => {
  const locationParts = buildLocationParts(locationData);
  const tooltipText = locationParts.join(', ');

  const { textRef, isTextTruncated } = useTextTruncation({
    text: tooltipText,
    maxWidth: 160,
  });

  const tooltipTrigger = tooltipText ? (
    <span ref={textRef} className="line-clamp-1 max-w-40 truncate capitalize">
      {tooltipText}
    </span>
  ) : null;

  return (
    <TooltipWrapperDark
      showTooltip={isTextTruncated}
      trigger={tooltipTrigger}
      content={<span className="capitalize">{tooltipText}</span>}
      tooltipAlign="center"
      tooltipSide="top"
    />
  );
};

const StandardLocationDisplay = ({
  locationData,
  showTruncatedText,
  isValueOrientationRight,
}: {
  locationData: LocationData;
  showTruncatedText: boolean;
  isValueOrientationRight: boolean;
}) => {
  const { city, normalizedCountry, isMultipleLocations } = locationData;

  return (
    <>
      {city && city !== '-' && (
        <span
          title={city}
          className={cn('max-w-24 truncate text-right', {
            'max-w-full': isValueOrientationRight,
          })}
        >
          {`${city},`}
        </span>
      )}
      <span
        title={normalizedCountry}
        className={cn('capitalize', {
          'max-w-24 truncate': showTruncatedText,
          'max-w-full': isValueOrientationRight,
        })}
      >
        {normalizedCountry}
      </span>
      {isMultipleLocations && <span>,</span>}
    </>
  );
};

const LocationCellValue = ({
  value,
  showTruncatedText = true,
  isValueOrientationRight = false,
  showTooltip = false,
}: LocationCellValueProps) => {
  const locationData = extractLocationData(value);

  return (
    <div
      className={cn('flex gap-1', {
        'w-full justify-end': isValueOrientationRight,
      })}
    >
      {locationData.hasFlag && (
        <LocationFlag flagUrl={locationData.flagUrl!} country={locationData.normalizedCountry} />
      )}

      {showTooltip ? (
        <TooltipContent locationData={locationData} />
      ) : (
        <StandardLocationDisplay
          locationData={locationData}
          showTruncatedText={showTruncatedText}
          isValueOrientationRight={isValueOrientationRight}
        />
      )}
    </div>
  );
};

export default LocationCellValue;
