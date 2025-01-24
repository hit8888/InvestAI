import { TableAllFilterConfig } from '@meaku/core/types/admin/filters';
import { COMMON_ICON_PROPS } from '../../utils/constants';
import FilterGreenDotIcon from '@breakout/design-system/components/icons/filter-green-dot';

const SingleFilterState = ({
  filterIcon: FilterIcon,
  filterLabel,
  filterValue,
  filterApplied,
  handleFilterClick,
}: TableAllFilterConfig) => {
  return (
    <button
      type="button"
      aria-label={`${filterLabel} Button`}
      onClick={handleFilterClick}
      className="flex w-full self-stretch bg-white p-4 hover:bg-primary/5 focus:border-2 focus:border-primary focus:bg-primary/5 focus:outline-none focus:ring-offset-0"
    >
      <div className="flex w-full items-center justify-between gap-4 self-stretch">
        <div className="flex items-center gap-4">
          <FilterIcon
            {...COMMON_ICON_PROPS}
            color={filterApplied ? 'rgb(var(--primary))' : 'rgb(var(--primary),0.6)'}
            className="text-primary/60"
          />
          <p className="flex-1 text-base font-normal text-gray-900">{filterLabel}</p>
        </div>
        <div className="flex items-center gap-4">
          <p className="text-right text-sm font-normal capitalize text-gray-500">{filterValue}</p>
          {filterApplied ? <FilterGreenDotIcon className="text-positive-1000" /> : null}
        </div>
      </div>
    </button>
  );
};

export default SingleFilterState;
