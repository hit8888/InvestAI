import CrossIcon from '@breakout/design-system/components/icons/cross-icon';
import LocationCellValue from './tableCellComp/LocationCellValue';
import { COMMON_ICON_PROPS } from '../../utils/constants';

type SingleAppliedFilterProps = {
  filter: { key: string; label: string; value: string | string[] };
  handleRemove: () => void;
};

const SingleAppliedFilter = ({ filter, handleRemove }: SingleAppliedFilterProps) => {
  return (
    <div
      key={filter.key}
      className="flex items-center justify-center gap-2 rounded-lg border border-primary/60 bg-primary/10 p-2"
    >
      <span className="text-xs font-normal text-gray-500">{filter.label}:</span>
      {filter.key === 'location' ? (
        <>
          {(filter.value as string[]).map((location: string, index: number) => (
            <span key={index} className="text-sm font-semibold capitalize text-primary">
              <LocationCellValue value={location + (index < (filter.value as string[]).length - 1 ? ', ' : '')} />
            </span>
          ))}
        </>
      ) : (
        <span className="text-sm font-semibold capitalize text-primary">{filter.value}</span>
      )}
      <button onClick={handleRemove} type="button" aria-label="Remove Filter" className="cursor-pointer">
        <CrossIcon {...COMMON_ICON_PROPS} />
      </button>
    </div>
  );
};

export default SingleAppliedFilter;
