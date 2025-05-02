import React from 'react';
import { useAllFilterStore } from '../../stores/useAllFilterStore';
import {
  CONVERSATIONS_TABLE_FILTERS_CONFIG,
  LEADS_TABLE_FILTERS_CONFIG,
  USER_MESSAGES_COUNT_FILTER_MAX_THRESHOLD,
} from '../../utils/constants';
import { getDateAppliedValue } from '../../utils/common';
import SingleFilterState from './SingleFilterState';
import CustomFooterWithButtons from './CustomFooterWithButtons';
import { FilterType, PageTypeProps } from '@meaku/core/types/admin/filters';
import { LEADS_PAGE } from '@meaku/core/utils/index';
import TestConversationIncludedFilter from './TestConversationIncludedFilter';

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
  const { DateRange, IntentScore, Location, MeetingBooked, ProductOfInterest, Company, UserMessagesCount } = FilterType;

  const isLeadsPage = page === LEADS_PAGE;

  const filterConfig = isLeadsPage ? LEADS_TABLE_FILTERS_CONFIG : CONVERSATIONS_TABLE_FILTERS_CONFIG;
  const handleClearAll = () => {
    resetPageFilters(page);
    handleFilterState(FilterType.AllFilters);
    handleClosePopover();
  };

  const filters = useAllFilterStore();
  const isFilterApplied = (filterKey: string) => {
    const { dateRange, intentScore, location, company, productOfInterest, userMessagesCount, meetingBooked } =
      filters[page];
    switch (filterKey) {
      case DateRange:
        return !!dateRange;
      case IntentScore:
        return intentScore.length > 0;
      case Location:
        return location.length > 0;
      case Company:
        return company.length > 0;
      case ProductOfInterest:
        return productOfInterest.length > 0;
      case UserMessagesCount:
        return userMessagesCount.minCount > 0 && userMessagesCount.maxCount <= USER_MESSAGES_COUNT_FILTER_MAX_THRESHOLD;
      case MeetingBooked:
        return !!meetingBooked;
      default:
        return false;
    }
  };

  const getCurrentValue = (filterKey: string) => {
    const { dateRange, intentScore, location, company, productOfInterest, userMessagesCount, meetingBooked } =
      filters[page];
    switch (filterKey) {
      case DateRange:
        return dateRange ? getDateAppliedValue(dateRange) : 'Any';
      case IntentScore:
        return intentScore.length > 0 ? `${intentScore.length} selected` : 'Any';
      case Location:
        return location.length > 0 ? `${location.length} selected` : 'Any';
      case Company:
        return company.length > 0 ? `${company.length} selected` : 'Any';
      case UserMessagesCount:
        return userMessagesCount.minCount > 0 && userMessagesCount.maxCount <= USER_MESSAGES_COUNT_FILTER_MAX_THRESHOLD
          ? `${userMessagesCount.minCount} To ${userMessagesCount.maxCount} messages`
          : 'Any';
      case ProductOfInterest:
        return productOfInterest.length > 0 ? `${productOfInterest.length} selected` : 'Any';
      case MeetingBooked:
        return meetingBooked || 'Any';
      default:
        return 'Any';
    }
  };

  const areFiltersApplied =
    filterConfig.some((config) => isFilterApplied(config.filterKey)) || filters[page].testConversationsIncluded;

  return (
    <React.Fragment key={FilterType.AllFilters}>
      {!isLeadsPage ? <TestConversationIncludedFilter page={page} /> : null}
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
        isPrimaryBtnClearAll={true}
        primaryBtnLabel={'Clear All'}
        onPrimaryBtnClicked={handleClearAll}
      />
    </React.Fragment>
  );
};

export default AllSelectableFilterContent;
