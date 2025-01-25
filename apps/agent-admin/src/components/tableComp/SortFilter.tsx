import React, { useState } from 'react';
import { SortCategory, SortValues } from '@meaku/core/types/admin/sort';
import SortFilterIcon from '@breakout/design-system/components/icons/sort-filter-icon';
import { COMMON_ICON_PROPS, SORT_FILTER_CONFIG } from '../../utils/constants';
import { Popover, PopoverContent, PopoverTrigger } from '@breakout/design-system/components/Popover/index';
import PopoverHeaderLabelWithCloseIcon from './PopoverHeaderLabelWithCloseIcon';
import CategorisedRadioHeaderLabel from './CategorisedRadioHeaderLabel';
import CustomRadioGroupButtons from './CustomRadioGroupButtons';
import { useSortFilterStore } from '../../stores/useSortFilterStore';
import { PageTypeProps } from '../../utils/admin-types';
import { LEADS_PAGE } from '@meaku/core/utils/index';

const SortFilter = ({ page }: PageTypeProps) => {
  const { setSortValue } = useSortFilterStore();
  const [isOpen, setIsOpen] = useState(false);
  const sortValues = useSortFilterStore((state) => state[page]);

  const handleRadioOptions = (categoryLabel: SortCategory, selectedOption: string) => {
    setSortValue(page, categoryLabel, selectedOption);
    setIsOpen(false);
  };

  const SORT_FEATURE_CONFIG_BASED_ON_PAGE = page === LEADS_PAGE ? SORT_FILTER_CONFIG.slice(0, 1) : SORT_FILTER_CONFIG;
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger
        className="flex items-center justify-center gap-2 rounded-lg 
      border border-primary/20 bg-primary/2.5 p-2 focus:bg-primary/10 focus:outline-none 
      focus:ring-2 focus:ring-primary/60 data-[state=open]:border-2 data-[state=open]:border-primary"
      >
        <p className="text-sm font-medium text-gray-500">Sort</p>
        <SortFilterIcon {...COMMON_ICON_PROPS} />
      </PopoverTrigger>
      <PopoverContent
        className="popover-boxshadow z-20 w-80 rounded-lg bg-white p-0"
        align="end"
        side="bottom"
        sideOffset={10}
      >
        <PopoverHeaderLabelWithCloseIcon headerLabel="Sort by:" />
        {SORT_FEATURE_CONFIG_BASED_ON_PAGE.map((config) => (
          <React.Fragment key={config.category}>
            <CategorisedRadioHeaderLabel headerLabel={config.headerLabel} />
            <CustomRadioGroupButtons
              radioOptions={config.radioOptions}
              onCallback={handleRadioOptions}
              defaultSelected={sortValues[config.stateKey as keyof SortValues] || null}
              category={config.category}
            />
          </React.Fragment>
        ))}
      </PopoverContent>
    </Popover>
  );
};

export default SortFilter;
