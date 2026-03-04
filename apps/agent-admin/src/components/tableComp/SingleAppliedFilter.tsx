import CrossIcon from '@breakout/design-system/components/icons/cross-icon';
import TooltipAddedAppliedFilter from './TooltipAddedAppliedFilter';
import { FilterType } from '@neuraltrade/core/types/admin/filters';
import { Popover, PopoverContent, PopoverTrigger } from '@breakout/design-system/components/Popover/index';
import { useState } from 'react';
import FilterContent from './FilterContent';
import PopoverHeaderLabelWithCloseIcon from './PopoverHeaderLabelWithCloseIcon';
import { PaginationPageType } from '@neuraltrade/core/types/admin/admin';
import { MULTI_VALUE_FILTER_TYPES } from '../../utils/constants';
import Typography from '@breakout/design-system/components/Typography/index';
import type { SdrAssignment } from '@neuraltrade/core/types/admin/api';

type SingleAppliedFilterProps = {
  filter: { key: string; label: string; value: string | string[] | boolean | SdrAssignment[] };
  handleRemove: (e: React.MouseEvent<HTMLButtonElement>) => void;
  handleAppliedFilterClicked: (filter: FilterType) => void;
  filterState: FilterType;
  handleClose: () => void;
  widthOfPopover: string;
  currentHeaderLabel: string;
  page: PaginationPageType;
};

const { DateRange, TestConversationIncluded, SessionIdIncluded, SdrAssignment, Sources } = FilterType;
const FILTER_KEYS_WITH_NO_POPOVER = [TestConversationIncluded, SessionIdIncluded];

const SingleAppliedFilter = ({
  filter,
  handleRemove,
  handleAppliedFilterClicked,
  filterState,
  handleClose,
  widthOfPopover,
  currentHeaderLabel,
  page,
}: SingleAppliedFilterProps) => {
  const [isFilterAppliedClicked, setIsFilterAppliedClicked] = useState(false);
  const isInvalidFilterKeys = FILTER_KEYS_WITH_NO_POPOVER.includes(filter.key as FilterType);

  const handleAppliedFilterClick = () => {
    if (!isInvalidFilterKeys) {
      handleAppliedFilterClicked(filter.key as FilterType);
      setIsFilterAppliedClicked(true);
    }
  };

  const handleClosePopover = () => {
    setIsFilterAppliedClicked(false);
    handleClose();
  };

  const handlePopoverOpen = () => {
    if (!isInvalidFilterKeys) {
      setIsFilterAppliedClicked(!isFilterAppliedClicked);
    }
  };

  const getFilterValue = () => {
    switch (filter.key) {
      case SdrAssignment:
        return (filter.value as SdrAssignment[]).map((item) => item?.assigned_user?.full_name);
      case Sources:
        return (filter.value as string[]).map((item) => item.replace(/_/g, ' ').toLowerCase());
      default:
        return filter.value;
    }
  };

  const filterValue = getFilterValue();
  return (
    <Popover open={isFilterAppliedClicked} onOpenChange={handlePopoverOpen}>
      <PopoverTrigger
        key={filter.key}
        onClick={handleAppliedFilterClick}
        className="popover-styling border-gray-200-styling flex cursor-pointer items-center justify-center gap-2 border-gray-200"
      >
        <span className="text-xs font-normal text-gray-400">{filter.label}:</span>
        {MULTI_VALUE_FILTER_TYPES.includes(filter.key as FilterType) ? (
          <TooltipAddedAppliedFilter appliedFilterValues={filterValue as string[]} />
        ) : (
          <Typography variant="label-14-medium" className="lowercase text-gray-600">
            {String(filter.value)}
          </Typography>
        )}
        <span
          onClick={(e) => handleRemove(e as React.MouseEvent<HTMLButtonElement>)}
          aria-label="Remove Filter"
          className="popover-styling cursor-pointer focus:border-gray-200-styling focus:!p-0"
        >
          <CrossIcon className="h-6 w-6 text-system" />
        </span>
      </PopoverTrigger>
      <PopoverContent
        className={`popover-boxshadow z-[100] rounded-lg bg-white p-0`}
        align="start"
        style={{ width: widthOfPopover }}
        side="bottom"
        sideOffset={20}
        onPointerDownOutside={handleClosePopover}
      >
        {filterState !== DateRange ? (
          <PopoverHeaderLabelWithCloseIcon onClose={handleClosePopover} headerLabel={currentHeaderLabel} />
        ) : null}
        <FilterContent filterState={filterState} handleClosePopover={handleClosePopover} page={page} />
      </PopoverContent>
    </Popover>
  );
};

export default SingleAppliedFilter;
