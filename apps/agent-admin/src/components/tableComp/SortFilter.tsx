import React, { useState } from 'react';
import { SortCategory, SortValues } from '@meaku/core/types/admin/sort';
import SortFilterIcon from '@breakout/design-system/components/icons/sort-filter-icon';
import { SORT_FILTER_CONFIG } from '../../utils/constants';
import { Popover, PopoverContent, PopoverTrigger } from '@breakout/design-system/components/Popover/index';
import PopoverHeaderLabelWithCloseIcon from './PopoverHeaderLabelWithCloseIcon';
import CategorisedRadioHeaderLabel from './CategorisedRadioHeaderLabel';
import CustomRadioGroupButtons from './CustomRadioGroupButtons';
import { useSortFilterStore } from '../../stores/useSortFilterStore';
import { PageTypeProps } from '@meaku/core/types/admin/filters';
import { LEADS_PAGE } from '@meaku/core/utils/index';
import { cn } from '@breakout/design-system/lib/cn';

type IProps = PageTypeProps & {
  disabledState?: boolean;
};

const SortFilter = ({ page, disabledState }: IProps) => {
  const { setSortValue } = useSortFilterStore();
  const [isOpen, setIsOpen] = useState(false);
  const sortValues = useSortFilterStore((state) => state[page]);

  const handleRadioOptions = (categoryLabel: SortCategory, selectedOption: string) => {
    setSortValue(page, categoryLabel, selectedOption);
    setIsOpen(false);
  };

  const handleOpenChange = (open: boolean) => {
    if (!disabledState) {
      setIsOpen(open);
    }
  };

  const SORT_FEATURE_CONFIG_BASED_ON_PAGE = page === LEADS_PAGE ? SORT_FILTER_CONFIG.slice(0, 1) : SORT_FILTER_CONFIG;
  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger
        className={cn('popover-styling border-gray-200-styling flex items-center justify-center gap-2', {
          'pointer-events-none opacity-50': disabledState,
        })}
      >
        <p className="text-sm font-medium text-gray-600">Sort</p>
        <span className="h-5 w-5">
          <SortFilterIcon className="h-6 w-6 text-system" />
        </span>
      </PopoverTrigger>
      <PopoverContent
        className="popover-boxshadow z-[100] w-80 rounded-lg bg-white p-0"
        align="end"
        side="bottom"
        sideOffset={20}
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
