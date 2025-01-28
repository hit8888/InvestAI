import React from 'react';
import { useAllFilterStore } from '../../stores/useAllFilterStore';
import { CONVERSATIONS_TABLE_FILTERS_CONFIG, LEADS_TABLE_FILTERS_CONFIG } from '../../utils/constants';
import { getDateAppliedValue } from '../../utils/common';
import SingleFilterState from './SingleFilterState';
import CustomFooterWithButtons from './CustomFooterWithButtons';
import { PageTypeProps } from '../../utils/admin-types';
import { FilterType } from '@meaku/core/types/admin/filters';
import { LEADS_PAGE } from '@meaku/core/utils/index';

type AllSelectableFilterContentProps = PageTypeProps & {
  handleFilterState: (value: FilterType) => void;
  handleClosePopover: () => void;
};

const AllSelectableFilterContent = ({
  page,
  handleClosePopover,
  handleFilterState,
}: AllSelectableFilterContentProps) => {
  const { resetPageFilters } = useAllFilterStore();
  const { DateRange, IntentScore, Location, MeetingBooked, ProductOfInterest } = FilterType;

  const filterConfig = page === LEADS_PAGE ? LEADS_TABLE_FILTERS_CONFIG : CONVERSATIONS_TABLE_FILTERS_CONFIG;
  const handleClearAll = () => {
    resetPageFilters(page);
    handleFilterState(FilterType.AllFilters);
    handleClosePopover();
  };

  const filters = useAllFilterStore();
  const isFilterApplied = (filterKey: string) => {
    switch (filterKey) {
      case DateRange:
        return !!filters[page].dateRange;
      case IntentScore:
        return filters[page].intentScore.length > 0;
      case Location:
        return filters[page].location.length > 0;
      case ProductOfInterest:
        return filters[page].productOfInterest.length > 0;
      case MeetingBooked:
        return !!filters[page].meetingBooked;
      default:
        return false;
    }
  };

  const getCurrentValue = (filterKey: string) => {
    switch (filterKey) {
      case DateRange:
        return filters[page].dateRange ? getDateAppliedValue(filters[page].dateRange) : 'Any';
      case IntentScore:
        return filters[page].intentScore.length > 0 ? `${filters[page].intentScore.length} selected` : 'Any';
      case Location:
        return filters[page].location.length > 0 ? `${filters[page].location.length} selected` : 'Any';
      case ProductOfInterest:
        return filters[page].productOfInterest.length > 0
          ? `${filters[page].productOfInterest.length} selected`
          : 'Any';
      case MeetingBooked:
        return filters[page].meetingBooked || 'Any';
      default:
        return 'Any';
    }
  };

  const areFiltersApplied = filterConfig.some((config) => isFilterApplied(config.filterKey));

  return (
    <React.Fragment key={FilterType.AllFilters}>
      {filterConfig.map((config) => (
        <SingleFilterState
          key={config.filterKey}
          {...config}
          filterApplied={isFilterApplied(config.filterKey)}
          filterValue={getCurrentValue(config.filterKey)}
          handleFilterClick={() => handleFilterState(config.filterType)}
        />
      ))}
      <CustomFooterWithButtons
        isDisabled={!areFiltersApplied}
        isSecondaryBtnClearAll={true}
        secondaryBtnLabel={'Clear All'}
        onSecondaryBtnClicked={handleClearAll}
      />
    </React.Fragment>
  );
};

export default AllSelectableFilterContent;
