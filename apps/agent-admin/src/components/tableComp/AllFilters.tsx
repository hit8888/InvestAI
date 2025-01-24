import AllFiltersIcon from '@breakout/design-system/components/icons/all-filters';
import { ALL_FILTERS_ICONS } from '../../utils/constants';

const AllFilters = () => {
  return (
    <div className="flex items-center gap-1 self-stretch rounded-lg border border-primary/20 bg-primary/2.5 p-2">
      <span className="h-5 w-5">
        <AllFiltersIcon {...ALL_FILTERS_ICONS} />
      </span>
      <p className="text-sm font-medium text-primary">All Filters</p>
    </div>
  );
};

export default AllFilters;
