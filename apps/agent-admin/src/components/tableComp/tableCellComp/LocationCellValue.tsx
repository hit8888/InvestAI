import { CellValueProps } from '@meaku/core/types/admin/admin-table';
import { findFlagUrlByCountryName } from 'country-flags-svg';

const SPECIAL_LOCATION_VALUE = 'Russian Federation';

const LocationCellValue: React.FC<CellValueProps> = ({ value }: { value: string }) => {
  const isLocationMultiple = value.includes(',');
  const isSpecialLocation = value === SPECIAL_LOCATION_VALUE;
  const locationValue = isLocationMultiple ? `${value.split(',')[0]}` : isSpecialLocation ? 'Russia' : value;
  const flagURL = value ? findFlagUrlByCountryName(locationValue) : undefined;
  return (
    <span className="flex gap-2">
      {flagURL ? <img src={flagURL} width={20} height={20} alt={`${locationValue} flag-icon`} /> : null}
      {isLocationMultiple ? value : locationValue}
    </span>
  );
};

export default LocationCellValue;
