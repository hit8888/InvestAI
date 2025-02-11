import React, { useState } from 'react';
import CustomCheckboxItem from './CustomCheckboxItem';
import CustomFooterWithButtons from './CustomFooterWithButtons';
import LocationCellValue from './tableCellComp/LocationCellValue';
import { cn } from '@breakout/design-system/lib/cn';
import BuyerIntentCellValue from './tableCellComp/BuyerIntentCellValue';
import FilterSelectAllContainer from './FilterSelectAllContainer';
import { FilterType } from '@meaku/core/types/admin/filters';

type CommonCheckboxesFilterContent = {
  isLocationFilter?: boolean;
  isBuyerIntentFilter?: boolean;
  keyValue: string;
  selectedOptions: string[];
  onSelectionChange: (value: string[]) => void;
  checkboxOptions: { value: string; label: string }[];
  handleClosePopover: () => void;
  filterState: FilterType;
  checkboxOrientation?: 'right' | 'left';
};
const CommonCheckboxesFilterContent = ({
  isLocationFilter = false,
  isBuyerIntentFilter = false,
  keyValue,
  checkboxOptions,
  selectedOptions,
  onSelectionChange,
  handleClosePopover,
  filterState,
  checkboxOrientation = 'left',
}: CommonCheckboxesFilterContent) => {
  const [selectedCheckboxes, setSelectedCheckboxes] = useState<string[]>(selectedOptions);
  const handleCheckboxToggle = (value: string) => {
    const newSelection = selectedCheckboxes.includes(value)
      ? selectedCheckboxes.filter((item) => item !== value)
      : [...selectedCheckboxes, value];
    setSelectedCheckboxes(newSelection);
    onSelectionChange(newSelection);
  };

  const handleClearAll = () => {
    setSelectedCheckboxes([]);
    onSelectionChange([]);
    handleClosePopover();
  };

  const handleSelectAll = () => {
    setSelectedCheckboxes(checkboxOptions.map((option) => option.value));
    onSelectionChange(checkboxOptions.map((option) => option.value));
    // handleClosePopover();
  };

  const areAllSelected = selectedCheckboxes.length === checkboxOptions.length;

  return (
    <React.Fragment key={keyValue}>
      <FilterSelectAllContainer
        handleSelectAll={handleSelectAll}
        handleClearAll={handleClearAll}
        filterState={filterState}
        areAllSelected={areAllSelected}
      />
      <div className={cn('hide-scrollbar max-h-56 overflow-auto')}>
        {checkboxOptions.map((option) => (
          <CustomCheckboxItem
            key={option.value}
            option={option}
            selectedCheckboxes={selectedCheckboxes}
            handleCheckboxToggle={handleCheckboxToggle}
            checkboxPosition={checkboxOrientation}
            renderLabel={
              isLocationFilter
                ? (label) => (
                    <div className="text-base font-normal text-gray-900">
                      <LocationCellValue value={label} showTruncatedText={false} />
                    </div>
                  )
                : isBuyerIntentFilter
                  ? (label) => <BuyerIntentCellValue value={`${label.toLowerCase()} Intent`} />
                  : undefined
            }
          />
        ))}
      </div>
      <CustomFooterWithButtons
        isDisabled={checkboxOptions.length === 0}
        isPrimaryBtnClearAll={true}
        primaryBtnLabel="Clear All"
        onPrimaryBtnClicked={handleClearAll}
      />
    </React.Fragment>
  );
};

export default CommonCheckboxesFilterContent;
