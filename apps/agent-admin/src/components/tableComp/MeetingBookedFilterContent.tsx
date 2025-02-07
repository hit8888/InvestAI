import React from 'react';
import { useAllFilterStore } from '../../stores/useAllFilterStore';
import CustomRadioGroupButtons from './CustomRadioGroupButtons';
import { FILTER_BY_MEETING_BOOKED_RADIO_OPTIONS } from '../../utils/constants';
import { CommonFilterContentPropsWithoutFilterState, FilterType } from '@meaku/core/types/admin/filters';

const MeetingBookedFilterContent = ({ page, handleClosePopover }: CommonFilterContentPropsWithoutFilterState) => {
  const filters = useAllFilterStore();
  const { MeetingBooked } = FilterType;
  const handleRadioOptions = (selectedOption: string) => {
    filters.setFilter(page, MeetingBooked, selectedOption);
    handleClosePopover();
  };
  return (
    <React.Fragment key={MeetingBooked}>
      <CustomRadioGroupButtons
        radioOptions={FILTER_BY_MEETING_BOOKED_RADIO_OPTIONS}
        onCallback={handleRadioOptions}
        defaultSelected={filters[page].meetingBooked}
      />
    </React.Fragment>
  );
};

export default MeetingBookedFilterContent;
