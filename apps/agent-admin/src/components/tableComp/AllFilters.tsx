import { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@breakout/design-system/components/Popover/index';
import { useAllFilterStore } from '../../stores/useAllFilterStore';
import { DateRangeProp, FilterValues, FilterValueTypes, PageTypeProps } from '@meaku/core/types/admin/filters';

import FilterContent from './FilterContent';
import SingleAppliedFilter from './SingleAppliedFilter';
import AllSelectableFilterContent from './AllSelectableFilterContent';
import AllFiltersIcon from '@breakout/design-system/components/icons/all-filters';
import PopoverHeaderLabelWithCloseIcon from './PopoverHeaderLabelWithCloseIcon';
import { collectAppliedFilters, getFilterHeaderLabel } from '../../utils/common';
import { FilterType } from '@meaku/core/types/admin/filters';
import SearchTableContentInput from '../SearchTableContentInput';

const {
  AllFilters,
  DateRange,
  IntentScore,
  Location,
  MeetingBooked,
  ProductOfInterest,
  ProductInterest,
  Company,
  UserMessagesCount,
  TestConversationIncluded,
  UsageCount,
  Sources,
  SearchTableContent,
  Duration,
  Status,
  FileType,
  AssignedUserEmail,
} = FilterType;

interface AllFiltersContainerProps extends PageTypeProps {
  isLeadsAndConversationsPage: boolean;
}

const AllFiltersContainer = ({ page, isLeadsAndConversationsPage }: AllFiltersContainerProps) => {
  const filters = useAllFilterStore();
  const [filterState, setFilterState] = useState(AllFilters);
  const [isOpen, setIsOpen] = useState(false);

  const handleFilterState = (value: FilterType) => {
    setFilterState(value);
  };

  const { label: currentHeaderLabel, width: widthOfPopover } = getFilterHeaderLabel(filterState);

  const handleClose = () => {
    setIsOpen(false);
    setFilterState(AllFilters);
  };
  const handleFilterRemove = (key: keyof FilterValues, value: Exclude<FilterValueTypes, DateRangeProp>) => {
    filters.setFilter(page, key, value);
    setIsOpen(false);
    setFilterState(AllFilters);
  };

  const handleFilterAppliedClicked = (key: FilterType) => {
    setFilterState(key);
  };

  const appliedFilters = collectAppliedFilters(filters[page]);

  const handleSingleFilterRemove = (key: string, e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    switch (key) {
      case DateRange:
        handleFilterRemove(key, undefined);
        break;
      case IntentScore:
      case Location:
      case Company:
      case ProductInterest:
      case ProductOfInterest:
      case AssignedUserEmail:
      case Sources:
      case FileType:
      case Status:
        handleFilterRemove(key, []);
        break;
      case SearchTableContent:
        handleFilterRemove(key, '');
        break;
      case UserMessagesCount:
        handleFilterRemove(key, {
          minCount: 0,
          maxCount: 100,
        });
        break;
      case UsageCount:
        handleFilterRemove(key, {
          minCount: 0,
          maxCount: 100,
        });
        break;
      case Duration:
        handleFilterRemove(key, {
          minDuration: 0,
          maxDuration: 100,
        });
        break;
      case MeetingBooked:
        handleFilterRemove(key, '');
        break;
      case TestConversationIncluded:
        handleFilterRemove(key, false);
        break;
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <div className="flex flex-wrap items-center justify-start gap-4">
        {!isLeadsAndConversationsPage && <SearchTableContentInput page={page} />}
        <PopoverTrigger className="popover-styling border-gray-200-styling flex items-center gap-2 self-stretch">
          <span className="h-5 w-5">
            <AllFiltersIcon className="h-6 w-6 text-system" />
          </span>
          <p className="text-sm font-medium text-gray-600">Filters</p>
          {appliedFilters.length > 0 && (
            <p className="flex h-5 w-5 items-center justify-center rounded-full bg-system p-0.5">
              <span className="text-xs font-medium text-white">{appliedFilters.length}</span>
            </p>
          )}
        </PopoverTrigger>
        {appliedFilters.map((filter) => (
          <SingleAppliedFilter
            key={filter.key}
            filter={filter}
            filterState={filterState}
            handleClose={handleClose}
            widthOfPopover={widthOfPopover}
            currentHeaderLabel={currentHeaderLabel}
            page={page}
            handleAppliedFilterClicked={handleFilterAppliedClicked}
            handleRemove={(e: React.MouseEvent<HTMLButtonElement>) => handleSingleFilterRemove(filter.key, e)}
          />
        ))}
      </div>
      <PopoverContent
        className={`popover-boxshadow z-[100] rounded-lg bg-white p-0`}
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
