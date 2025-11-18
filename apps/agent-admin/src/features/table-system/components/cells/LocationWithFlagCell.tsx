import { findFlagUrlByCountryName } from 'country-flags-svg';
import { CellContainer } from './CellContainer';
import EmptyCell from './EmptyCell';

interface LocationWithFlagCellProps {
  /** Country value from the primary field */
  value: string | null | undefined;
  /** Optional tooltip text */
  tooltip?: string;
}

// Country name mappings for flag library compatibility (from V1)
const COUNTRY_NAME_MAPPING: Record<string, string> = {
  'Russian Federation': 'Russia',
  Czechia: 'Czech Republic',
  'Korea, Republic of': 'South Korea',
  Türkiye: 'Turkey',
};

// Countries without available flags in the library (from V1)
const COUNTRIES_WITHOUT_FLAGS = [
  'Bolivia',
  'Democratic Republic of the Congo',
  'Holy See',
  'Ireland',
  'Palestine',
  'Réunion',
  'Sao Tome and Principe',
  'Syria',
];

const normalizeCountryName = (country: string): string => {
  if (COUNTRY_NAME_MAPPING[country]) {
    return COUNTRY_NAME_MAPPING[country];
  }
  if (country?.includes(',')) {
    return country.split(',')[0].trim();
  }
  return country;
};

/**
 * LocationWithFlagCell - Pure component for displaying location with flag
 *
 * This component is now metadata-driven and receives pre-processed props:
 * - value: Country value from primary field
 * - tooltip: Tooltip text from TOOLTIP metadata relations (optional)
 *
 * No business logic - just renders the provided country with flag!
 */
export const LocationWithFlagCell = ({ value, tooltip }: LocationWithFlagCellProps) => {
  if (!value) {
    return <EmptyCell />;
  }

  // Normalize country name
  const normalizedCountry = normalizeCountryName(value);

  // Get flag URL from country-flags-svg library (V1 method)
  const flagUrl = findFlagUrlByCountryName(normalizedCountry);
  const hasFlag = Boolean(flagUrl && !COUNTRIES_WITHOUT_FLAGS.includes(normalizedCountry));

  return (
    <CellContainer title={tooltip || normalizedCountry}>
      {/* Flag */}
      {hasFlag && flagUrl && (
        <img src={flagUrl} width={20} height={20} alt={`${normalizedCountry} flag`} className="flex-shrink-0" />
      )}

      {/* Location Text */}
      <span className="truncate text-sm capitalize text-gray-900">{normalizedCountry}</span>
    </CellContainer>
  );
};
