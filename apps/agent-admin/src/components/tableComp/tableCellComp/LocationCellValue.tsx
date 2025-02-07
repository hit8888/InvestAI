import { cn } from '@breakout/design-system/lib/cn';
import { CellValueProps } from '@meaku/core/types/admin/admin-table';
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

type IProps = CellValueProps & {
  showTruncatedText?: boolean;
};

const LocationCellValue = ({ value, showTruncatedText = true }: IProps) => {
  const isLocationMultiple = value.includes(',');
  const isSpecialLocation = value === SPECIAL_LOCATION_VALUE;
  const locationValue = isLocationMultiple ? `${value.split(',')[0]}` : isSpecialLocation ? 'Russia' : value;
  const flagURL = value ? findFlagUrlByCountryName(locationValue) : undefined;
  const isValueBelongToNoCountryFlag = COUNTRY_WITH_NO_FLAGS.includes(locationValue);
  return (
    <div className="flex">
      <p className="flex gap-2">
        {flagURL && !isValueBelongToNoCountryFlag ? (
          <img src={flagURL} width={20} height={20} alt={`${locationValue} flag-icon`} />
        ) : null}
        <span
          title={locationValue}
          className={cn({
            'max-w-40 truncate': showTruncatedText,
          })}
        >
          {locationValue}
        </span>
      </p>
      {isLocationMultiple && <>{','}</>}
    </div>
  );
};

export default LocationCellValue;
