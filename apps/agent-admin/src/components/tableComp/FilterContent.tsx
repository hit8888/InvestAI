import React from 'react';
import DateRangePickerFilterContent from './DateRangePickerFilterContent';
import IntentScoreFilterContent from './IntentScoreFilterContent';
import MeetingBookedFilterContent from './MeetingBookedFilterContent';
import LocationFilterContent from './LocationFilterContent';
import ProductOfInterestFilterContent from './ProductOfInterestFilterContent';
import { PageTypeProps } from '../../utils/admin-types';
import { FilterType } from '@meaku/core/types/admin/filters';

type FilterContentProps = PageTypeProps & {
  filterState: FilterType;
  handleClosePopover: () => void;
};

const FilterContent = ({ filterState, handleClosePopover, page }: FilterContentProps) => {
  const { DateRange, IntentScore, MeetingBooked, Location, ProductOfInterest } = FilterType;
  return (
    <React.Fragment>
      {filterState === DateRange ? (
        <DateRangePickerFilterContent page={page} handleClosePopover={handleClosePopover} />
      ) : null}
      {filterState === IntentScore ? (
        <IntentScoreFilterContent page={page} handleClosePopover={handleClosePopover} />
      ) : null}
      {filterState === MeetingBooked ? (
        <MeetingBookedFilterContent page={page} handleClosePopover={handleClosePopover} />
      ) : null}
      {filterState === Location ? <LocationFilterContent page={page} handleClosePopover={handleClosePopover} /> : null}
      {filterState === ProductOfInterest ? (
        <ProductOfInterestFilterContent page={page} handleClosePopover={handleClosePopover} />
      ) : null}
    </React.Fragment>
  );
};

export default FilterContent;
