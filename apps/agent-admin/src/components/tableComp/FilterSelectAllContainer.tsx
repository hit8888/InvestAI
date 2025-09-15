import { cn } from '@breakout/design-system/lib/cn';
import { FilterType } from '@meaku/core/types/admin/filters';
import CustomCheckboxItem from './CustomCheckboxItem';
import { useEffect, useState } from 'react';
import SelectAllToggleButton from './SelectAllToggleButton';
import { CheckboxValue } from '../../utils/checkboxUtils';

type IProps = {
  filterState: FilterType;
  areAllSelected: boolean;
  handleSelectAll: () => void;
  handleClearAll: () => void;
};

const { IntentScore, Location, ProductOfInterest, Company, SdrAssignment } = FilterType;

const SELECT_ALL_CHECKBOX_ITEM = {
  value: 'select-all',
  label: 'Select All',
};

const CHECKBOX_INITIAL_VALUE = ['select-all'];

const FiltersWithSelectAllCheckbox = [IntentScore, ProductOfInterest, SdrAssignment];

const FilterWithToggleSwitchButton = [Location, Company];

const FilterSelectAllContainer = ({ filterState, areAllSelected, handleSelectAll, handleClearAll }: IProps) => {
  const [selectedCheckbox, setSelectedCheckbox] = useState<CheckboxValue[]>([]);
  const isSelectAllCheckboxPresent = FiltersWithSelectAllCheckbox.includes(filterState);
  const isSelectAllTogglePresent = FilterWithToggleSwitchButton.includes(filterState);

  const handleSingleCheckboxToggle = (value: CheckboxValue) => {
    if (selectedCheckbox.includes(value)) {
      setSelectedCheckbox([]);
      handleClearAll();
    } else {
      setSelectedCheckbox([value]);
      handleSelectAll();
    }
  };

  useEffect(() => {
    if (areAllSelected) {
      setSelectedCheckbox(CHECKBOX_INITIAL_VALUE);
    } else {
      setSelectedCheckbox([]);
    }
  }, [areAllSelected]);

  if (!isSelectAllCheckboxPresent && !isSelectAllTogglePresent) return;
  return (
    <div
      className={cn('flex w-full items-start justify-between', {
        'border-b border-gray-200': isSelectAllCheckboxPresent,
      })}
    >
      {isSelectAllCheckboxPresent ? (
        <CustomCheckboxItem
          option={SELECT_ALL_CHECKBOX_ITEM}
          selectedCheckboxes={selectedCheckbox}
          handleCheckboxToggle={handleSingleCheckboxToggle}
        />
      ) : null}
      {isSelectAllTogglePresent ? (
        <SelectAllToggleButton
          isSelected={selectedCheckbox.length > 0}
          handleSingleCheckboxToggle={handleSingleCheckboxToggle}
        />
      ) : null}
    </div>
  );
};

export default FilterSelectAllContainer;
