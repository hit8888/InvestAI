import React from 'react';
import { useAllFilterStore } from '../../stores/useAllFilterStore';
import { USER_MESSAGES_COUNT_FILTER_MAX_THRESHOLD } from '../../utils/constants';
import { getDateAppliedValue, getFiltersConfig, getOrderedBuyerIntent } from '../../utils/common';
import SingleFilterState from './SingleFilterState';
import CustomFooterWithButtons from './CustomFooterWithButtons';
import { FilterType, PageTypeProps } from '@meaku/core/types/admin/filters';
import { CONVERSATIONS_PAGE, LEADS_PAGE } from '@meaku/core/utils/index';
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
  const {
    DateRange,
    IntentScore,
    Location,
    MeetingBooked,
    ProductOfInterest,
    Company,
    UserMessagesCount,
    Duration,
    UsageCount,
    Sources,
    Status,
  } = FilterType;

  const isConversationsAndLeadsPage = page === CONVERSATIONS_PAGE || page === LEADS_PAGE;

  // All filters config
  const filterConfig = [...getFiltersConfig(page)];

  const handleClearAll = () => {
    resetPageFilters(page);
    handleFilterState(FilterType.AllFilters);
    handleClosePopover();
  };

  const filters = useAllFilterStore();
  const isFilterApplied = (filterKey: string) => {
    const {
      dateRange,
      intentScore,
      location,
      company,
      productOfInterest,
      userMessagesCount,
      meetingBooked,
      sources,
      duration,
      usageCount,
      status,
    } = filters[page];
    switch (filterKey) {
      case DateRange:
        return !!dateRange;
      case IntentScore:
        return intentScore.length > 0;
      case Location:
        return location.length > 0;
      case Company:
        return company.length > 0;
      case Sources:
        return sources.length > 0;
      case Status:
        return status.length > 0;
      case ProductOfInterest:
        return productOfInterest.length > 0;
      case Duration:
        return duration.minDuration > 0 && duration.maxDuration <= USER_MESSAGES_COUNT_FILTER_MAX_THRESHOLD;
      case UsageCount:
        return usageCount.minCount > 0 && usageCount.maxCount <= USER_MESSAGES_COUNT_FILTER_MAX_THRESHOLD;
      case UserMessagesCount:
        return userMessagesCount.minCount > 0 && userMessagesCount.maxCount <= USER_MESSAGES_COUNT_FILTER_MAX_THRESHOLD;
      case MeetingBooked:
        return !!meetingBooked;
      default:
        return false;
    }
  };

  const getCurrentValue = (filterKey: string) => {
    const {
      dateRange,
      intentScore,
      location,
      company,
      productOfInterest,
      userMessagesCount,
      meetingBooked,
      duration,
      usageCount,
      sources,
      status,
    } = filters[page];
    switch (filterKey) {
      case DateRange:
        return dateRange ? getDateAppliedValue(dateRange) : 'Any';
      case IntentScore:
        return intentScore.length > 0 ? getOrderedBuyerIntent(intentScore).join(', ') : 'Any';
      case Location:
        return location.length > 0 ? `${location.length} selected` : 'Any';
      case Company:
        return company.length > 0 ? `${company.length} selected` : 'Any';
      case Sources:
        return sources.length > 0 ? `${sources.length} selected` : 'Any';
      case Status:
        return status.length > 0 ? `${status.length} selected` : 'Any';
      case UserMessagesCount:
        return userMessagesCount.minCount > 0 && userMessagesCount.maxCount <= USER_MESSAGES_COUNT_FILTER_MAX_THRESHOLD
          ? `${userMessagesCount.minCount} To ${userMessagesCount.maxCount} messages`
          : 'Any';
      case Duration:
        return duration.minDuration > 0 && duration.maxDuration <= USER_MESSAGES_COUNT_FILTER_MAX_THRESHOLD
          ? `${duration.minDuration} To ${duration.maxDuration} minutes`
          : 'Any';
      case UsageCount:
        return usageCount.minCount > 0 && usageCount.maxCount <= USER_MESSAGES_COUNT_FILTER_MAX_THRESHOLD
          ? `${usageCount.minCount} To ${usageCount.maxCount} usage`
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
      {isConversationsAndLeadsPage ? <TestConversationIncludedFilter page={page} /> : null}
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
