import React, { useState } from 'react';
import CustomCheckboxItem from './CustomCheckboxItem';
import CustomFooterWithButtons from './CustomFooterWithButtons';
import LocationCellValue from './tableCellComp/LocationCellValue';
import { cn } from '@breakout/design-system/lib/cn';
import BuyerIntentCellValue from './tableCellComp/BuyerIntentCellValue';
import FilterSelectAllContainer from './FilterSelectAllContainer';
import { FilterType } from '@meaku/core/types/admin/filters';
import DataSourceStatusChip from './tableCellComp/DataSourceStatusChip';
import { DATA_SOURCE_STATUS } from '../../pages/DataSourcesPage/constants';
import Typography from '@breakout/design-system/components/Typography/index';

type CommonCheckboxesFilterContent = {
  keyValue: string;
  selectedOptions: string[];
  onSelectionChange: (value: string[]) => void;
  checkboxOptions: { value: string; label: string }[];
  handleClosePopover: () => void;
  filterState: FilterType;
  checkboxOrientation?: 'right' | 'left';
};

const renderFilterLabel = (label: string, keyValue: string) => {
  switch (keyValue) {
    case FilterType.Location:
      return (
        <div className="text-base font-normal text-gray-900">
          <LocationCellValue value={label} showTruncatedText={false} />
        </div>
      );
    case FilterType.IntentScore:
      return <BuyerIntentCellValue value={`${label.toLowerCase()} Intent`} />;
    case FilterType.Status:
      return <DataSourceStatusChip status={label as DATA_SOURCE_STATUS} />;
    default:
      return <Typography variant="body-16">{label}</Typography>;
  }
};

const CommonCheckboxesFilterContent = ({
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
            renderLabel={(label) => renderFilterLabel(label, keyValue)}
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
