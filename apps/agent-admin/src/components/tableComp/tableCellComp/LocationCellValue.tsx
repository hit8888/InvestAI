import { CellValueProps } from '@meaku/core/types/admin/admin-table';
import { findFlagUrlByCountryName } from 'country-flags-svg';

const LocationCellValue: React.FC<CellValueProps> = ({ value }: { value: string }) => {
  const locationValue = value ? `${value}` : 'Location not specified';
  const flagURL = value ? findFlagUrlByCountryName(locationValue) : undefined;
  return (
    <span className="flex gap-2">
      {flagURL ? <img src={flagURL} width={20} height={20} alt={`${locationValue} flag-icon`} /> : null}
      {locationValue}
    </span>
  );
};

export default LocationCellValue;
