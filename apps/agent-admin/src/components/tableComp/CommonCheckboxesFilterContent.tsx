import React, { useState } from 'react';
import CustomCheckboxItem from './CustomCheckboxItem';
import CustomFooterWithButtons from './CustomFooterWithButtons';
import LocationCellValue from './tableCellComp/LocationCellValue';
import { cn } from '@breakout/design-system/lib/cn';

type CommonCheckboxesFilterContent = {
  isLocationFilter?: boolean;
  keyValue: string;
  selectedOptions: string[];
  onSelectionChange: (value: string[]) => void;
  checkboxOptions: { value: string; label: string }[];
  handleClosePopover: () => void;
};
const CommonCheckboxesFilterContent = ({
  isLocationFilter = false,
  keyValue,
  checkboxOptions,
  selectedOptions,
  onSelectionChange,
  handleClosePopover,
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
    handleClosePopover();
  };

  return (
    <React.Fragment key={keyValue}>
      <div className={cn('hide-scrollbar max-h-96 overflow-auto')}>
        {checkboxOptions.map((option) => (
          <CustomCheckboxItem
            key={option.value}
            option={option}
            selectedCheckboxes={selectedCheckboxes}
            handleCheckboxToggle={handleCheckboxToggle}
            checkboxPosition={isLocationFilter ? 'right' : 'left'}
            renderLabel={
              isLocationFilter
                ? (label) => (
                    <p className="text-base font-normal text-gray-900">
                      <LocationCellValue value={label} />
                    </p>
                  )
                : undefined
            }
          />
        ))}
      </div>
      <CustomFooterWithButtons
        primaryBtnLabel="Clear All"
        secondaryBtnLabel="Select All"
        onPrimaryBtnClicked={handleClearAll}
        onSecondaryBtnClicked={handleSelectAll}
      />
    </React.Fragment>
  );
};

export default CommonCheckboxesFilterContent;
