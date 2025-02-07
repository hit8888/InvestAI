import { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@breakout/design-system/components/Popover/index';
import { useAllFilterStore } from '../../stores/useAllFilterStore';
import { FilterValues, PageTypeProps } from '@meaku/core/types/admin/filters';

import FilterContent from './FilterContent';
import SingleAppliedFilter from './SingleAppliedFilter';
import AllSelectableFilterContent from './AllSelectableFilterContent';
import AllFiltersIcon from '@breakout/design-system/components/icons/all-filters';
import { ALL_FILTERS_ICONS } from '../../utils/constants';
import PopoverHeaderLabelWithCloseIcon from './PopoverHeaderLabelWithCloseIcon';
import { collectAppliedFilters, getFilterHeaderLabel } from '../../utils/common';
import { FilterType } from '@meaku/core/types/admin/filters';
import ExportDownload from './ExportDownload';

const { AllFilters, DateRange, IntentScore, Location, MeetingBooked, ProductOfInterest, Company, UserMessagesCount } =
  FilterType;

const AllFiltersContainer = ({ page }: PageTypeProps) => {
  const filters = useAllFilterStore();
  const [filterState, setFilterState] = useState(AllFilters);
  const [isOpen, setIsOpen] = useState(false);
  const handleFilterState = (value: FilterType) => {
    setFilterState(value);
  };

  const currentHeaderLabel = getFilterHeaderLabel(filterState).label;
  const widthOfPopover = getFilterHeaderLabel(filterState).width;

  const handleClose = () => {
    setIsOpen(false);
    setFilterState(AllFilters);
  };
  const handleFilterRemove = (key: keyof FilterValues, value: string | string[] | number | undefined) => {
    filters.setFilter(page, key, value);
  };

  const appliedFilters = collectAppliedFilters(filters[page]);

  const handleSingleFilterRemove = (key: string) => {
    switch (key) {
      case DateRange:
        handleFilterRemove(key, undefined);
        break;
      case IntentScore:
        handleFilterRemove(key, []);
        break;
      case Location:
        handleFilterRemove(key, []);
        break;
      case Company:
        handleFilterRemove(key, []);
        break;
      case ProductOfInterest:
        handleFilterRemove(key, []);
        break;
      case UserMessagesCount:
        handleFilterRemove(key, 0);
        break;
      case MeetingBooked:
        handleFilterRemove(key, '');
        break;
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <div className="flex flex-wrap items-center justify-start gap-4">
        <ExportDownload />
        <PopoverTrigger
          className="flex items-center gap-2 self-stretch rounded-lg 
        border border-primary/20 bg-primary/2.5 p-2 
        focus:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary/60 
        data-[state=open]:border-2 data-[state=open]:border-primary"
        >
          <span className="h-5 w-5">
            <AllFiltersIcon {...ALL_FILTERS_ICONS} />
          </span>
          <p className="text-sm font-medium text-primary">All Filters</p>
          {appliedFilters.length > 0 && (
            <p className="flex h-5 w-5 items-center justify-center rounded-full bg-primary p-0.5">
              <span className="text-xs font-medium text-white">{appliedFilters.length}</span>
            </p>
          )}
        </PopoverTrigger>
        {appliedFilters.map((filter) => (
          <SingleAppliedFilter
            key={filter.key}
            filter={filter}
            handleRemove={() => handleSingleFilterRemove(filter.key)}
          />
        ))}
      </div>
      <PopoverContent
        className={`popover-boxshadow z-50 rounded-lg bg-white p-0`}
        align="start"
        style={{ width: widthOfPopover }}
        side="bottom"
        sideOffset={20}
        onPointerDownOutside={handleClose}
      >
        {filterState !== DateRange ? (
          <PopoverHeaderLabelWithCloseIcon onClose={handleClose} headerLabel={currentHeaderLabel} />
        ) : null}
        {filterState === AllFilters ? (
          <AllSelectableFilterContent
            page={page}
            handleClosePopover={handleClose}
            handleFilterState={handleFilterState}
          />
        ) : null}
        <FilterContent filterState={filterState} handleClosePopover={handleClose} page={page} />
      </PopoverContent>
    </Popover>
  );
};

export default AllFiltersContainer;
