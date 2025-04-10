import { cn } from '@breakout/design-system/lib/cn';
import { LocationWithCityCountry } from '@meaku/core/types/admin/admin';
import { findFlagUrlByCountryName } from 'country-flags-svg';

const SPECIAL_LOCATION_VALUE = 'Russian Federation';
const COUNTRY_WITH_NO_FLAGS = [
  'Bolivia',
  'Democratic Republic of the Congo',
  'Holy See',
  'Ireland',
  'Palestine',
  'Réunion',
  'Sao Tome and Principe',
  'Syria',
];

type IProps = {
  value: string | LocationWithCityCountry;
  showTruncatedText?: boolean;
  isValueOrientationRight?: boolean;
};

const LocationCellValue = ({ value, showTruncatedText = true, isValueOrientationRight = false }: IProps) => {
  const isTypeOfValueObject = typeof value === 'object';
  const cityValue = isTypeOfValueObject ? value.city : '';
  const countryValue = isTypeOfValueObject ? value.country : value;
  const isLocationMultiple = countryValue?.includes(',');
  const isSpecialLocation = countryValue === SPECIAL_LOCATION_VALUE;
  const locationValue = isLocationMultiple
    ? `${countryValue.split(',')[0]}`
    : isSpecialLocation
      ? 'Russia'
      : countryValue;
  const flagURL = countryValue ? findFlagUrlByCountryName(locationValue) : undefined;
  const isValueBelongToNoCountryFlag = COUNTRY_WITH_NO_FLAGS.includes(locationValue);
  return (
    <div className={cn('flex gap-1', { 'w-full justify-end': isValueOrientationRight })}>
      {flagURL && !isValueBelongToNoCountryFlag ? (
        <img src={flagURL} width={20} height={20} alt={`${locationValue} flag-icon`} />
      ) : null}
      {isTypeOfValueObject && cityValue !== '-' ? (
        <span
          title={cityValue}
          className={cn('max-w-24 truncate text-right', { 'max-w-full': isValueOrientationRight })}
        >{`${cityValue},`}</span>
      ) : null}
      <span
        title={locationValue}
        className={cn('capitalize', {
          'max-w-24 truncate': showTruncatedText,
          'max-w-full': isValueOrientationRight,
        })}
      >
        {locationValue}
      </span>
      {isLocationMultiple && <>{','}</>}
    </div>
  );
};

export default LocationCellValue;
