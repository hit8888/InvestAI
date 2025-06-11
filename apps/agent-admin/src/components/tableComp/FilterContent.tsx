import React from 'react';
import DateRangePickerFilterContent from './DateRangePickerFilterContent';
import IntentScoreFilterContent from './IntentScoreFilterContent';
import MeetingBookedFilterContent from './MeetingBookedFilterContent';
import LocationFilterContent from './LocationFilterContent';
import ProductOfInterestFilterContent from './ProductOfInterestFilterContent';
import { CommonFilterContentProps, FilterType } from '@meaku/core/types/admin/filters';
import CompanyFilterContent from './CompanyFilterContent';
import UserMessagesCountFilterContent from './UserMessagesCountFilterContent';
import SourcesFilterContent from './SourcesFilterContent';
import StatusFilterContent from './StatusFilterContent';
import FileTypeFilterContent from './FileTypeFilterContent';

const FilterContent = ({ filterState, handleClosePopover, page }: CommonFilterContentProps) => {
  const {
    DateRange,
    Company,
    IntentScore,
    MeetingBooked,
    Location,
    ProductOfInterest,
    UserMessagesCount,
    Sources,
    Status,
    UsageCount,
    FileType,
  } = FilterType;
  return (
    <React.Fragment>
      {filterState === DateRange ? (
        <DateRangePickerFilterContent page={page} handleClosePopover={handleClosePopover} />
      ) : null}
      {filterState === IntentScore ? (
        <IntentScoreFilterContent filterState={filterState} page={page} handleClosePopover={handleClosePopover} />
      ) : null}
      {filterState === MeetingBooked ? (
        <MeetingBookedFilterContent page={page} handleClosePopover={handleClosePopover} />
      ) : null}
      {filterState === Location ? (
        <LocationFilterContent filterState={filterState} page={page} handleClosePopover={handleClosePopover} />
      ) : null}
      {filterState === Company ? (
        <CompanyFilterContent filterState={filterState} page={page} handleClosePopover={handleClosePopover} />
      ) : null}
      {filterState === Sources ? (
        <SourcesFilterContent filterState={filterState} page={page} handleClosePopover={handleClosePopover} />
      ) : null}
      {filterState === FileType ? (
        <FileTypeFilterContent filterState={filterState} page={page} handleClosePopover={handleClosePopover} />
      ) : null}
      {filterState === Status ? (
        <StatusFilterContent filterState={filterState} page={page} handleClosePopover={handleClosePopover} />
      ) : null}
      {filterState === ProductOfInterest ? (
        <ProductOfInterestFilterContent filterState={filterState} page={page} handleClosePopover={handleClosePopover} />
      ) : null}
      {filterState === UserMessagesCount ? <UserMessagesCountFilterContent page={page} /> : null}
      {filterState === UsageCount ? <UserMessagesCountFilterContent page={page} /> : null}
    </React.Fragment>
  );
};

export default FilterContent;
