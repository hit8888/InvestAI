import SortFilterIcon from '@breakout/design-system/components/icons/sort-filter-icon';
import { SORT_FILTER_ICON } from '../../utils/constants';

const SortFilter = () => {
  return (
    <div className="flex items-center justify-center gap-2 rounded-lg border border-primary/20 bg-primary/2.5 p-2">
      <p className="text-sm font-medium text-gray-500">Sort</p>
      <SortFilterIcon {...SORT_FILTER_ICON} />
    </div>
  );
};

export default SortFilter;
