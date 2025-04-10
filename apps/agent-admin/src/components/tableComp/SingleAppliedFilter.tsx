import CrossIcon from '@breakout/design-system/components/icons/cross-icon';
import TooltipAddedAppliedFilter from './TooltipAddedAppliedFilter';
import { COMMON_ICON_PROPS } from '../../utils/constants';
import { FilterType } from '@meaku/core/types/admin/filters';
import { Popover, PopoverContent, PopoverTrigger } from '@breakout/design-system/components/Popover/index';
import { useState } from 'react';
import FilterContent from './FilterContent';
import PopoverHeaderLabelWithCloseIcon from './PopoverHeaderLabelWithCloseIcon';
import { PageType } from '@meaku/core/types/admin/sort';

type SingleAppliedFilterProps = {
  filter: { key: string; label: string; value: string | string[] };
  handleRemove: (e: React.MouseEvent<HTMLButtonElement>) => void;
  handleAppliedFilterClicked: (filter: FilterType) => void;
  filterState: FilterType;
  handleClose: () => void;
  widthOfPopover: string;
  currentHeaderLabel: string;
  page: PageType;
};

const { Location, ProductOfInterest, Company, DateRange } = FilterType;

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
  const handleAppliedFilterClick = () => {
    handleAppliedFilterClicked(filter.key as FilterType);
    setIsFilterAppliedClicked(true);
  };

  const handleClosePopover = () => {
    setIsFilterAppliedClicked(false);
    handleClose();
  };
  return (
    <Popover open={isFilterAppliedClicked} onOpenChange={setIsFilterAppliedClicked}>
      <PopoverTrigger
        key={filter.key}
        onClick={handleAppliedFilterClick}
        className="popover-styling border-primary-20-styling flex cursor-pointer items-center justify-center gap-2 border-primary"
      >
        <span className="text-xs font-normal text-primary/70">{filter.label}:</span>
        {[Location, ProductOfInterest, Company].includes(filter.key as FilterType) ? (
          <TooltipAddedAppliedFilter appliedFilterValues={filter.value as string[]} />
        ) : (
          <span className="text-sm font-semibold capitalize text-primary">{filter.value}</span>
        )}
        <span
          onClick={(e) => handleRemove(e as React.MouseEvent<HTMLButtonElement>)}
          aria-label="Remove Filter"
          className="popover-styling cursor-pointer focus:border-primary-20-styling focus:!p-0"
        >
          <CrossIcon {...COMMON_ICON_PROPS} />
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
