import React, { useState } from 'react';
import CustomCheckboxItem from './CustomCheckboxItem';
import CustomFooterWithButtons from './CustomFooterWithButtons';
import LocationCellValue from './tableCellComp/LocationCellValue';
import { cn } from '@breakout/design-system/lib/cn';
import BuyerIntentCellValue from './tableCellComp/BuyerIntentCellValue';
import FilterSelectAllContainer from './FilterSelectAllContainer';
import { FilterType } from '@neuraltrade/core/types/admin/filters';
import DataSourceStatusChip from './tableCellComp/DataSourceStatusChip';
import { DATA_SOURCE_STATUS } from '../../pages/DataSourcesPage/constants';
import Typography from '@breakout/design-system/components/Typography/index';
import type { SdrAssignment } from '@neuraltrade/core/types/admin/api';
import SingleAssignRepCell from '../common/SingleAssignRepCell';
import {
  handleCheckboxToggle as utilHandleCheckboxToggle,
  mapOptionsToValues,
  getOptionKey,
  type CheckboxValue,
  type CheckboxOption,
} from '../../utils/checkboxUtils';

const { Location, IntentScore, Status, SdrAssignment } = FilterType;

type CommonCheckboxesFilterContent = {
  keyValue: string;
  selectedOptions: CheckboxValue[];
  onSelectionChange: (value: CheckboxValue[]) => void;
  checkboxOptions: CheckboxOption[];
  handleClosePopover: () => void;
  filterState: FilterType;
  checkboxOrientation?: 'right' | 'left';
};

const renderFilterLabel = (label: string, keyValue: string, value?: CheckboxValue) => {
  switch (keyValue) {
    case Location:
      return (
        <div className="text-base font-normal text-gray-900">
          <LocationCellValue value={label} showTruncatedText={false} />
        </div>
      );
    case IntentScore:
      return <BuyerIntentCellValue value={`${label.toLowerCase()} Intent`} />;
    case Status:
      return <DataSourceStatusChip status={label as DATA_SOURCE_STATUS} />;
    case SdrAssignment:
      return value ? (
        <SingleAssignRepCell listValue={value as SdrAssignment} />
      ) : (
        <Typography variant="body-16">{label}</Typography>
      );
    default:
      return (
        <Typography variant="body-16" className="flex-1 text-left capitalize">
          {label}
        </Typography>
      );
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
  const [selectedCheckboxes, setSelectedCheckboxes] = useState<CheckboxValue[]>(selectedOptions);

  const handleCheckboxToggle = (value: CheckboxValue) => {
    const newSelection = utilHandleCheckboxToggle(value, selectedCheckboxes);
    setSelectedCheckboxes(newSelection);
    onSelectionChange(newSelection);
  };

  const handleClearAll = () => {
    setSelectedCheckboxes([]);
    onSelectionChange([]);
    handleClosePopover();
  };

  const handleSelectAll = () => {
    const allValues = mapOptionsToValues(checkboxOptions);
    setSelectedCheckboxes(allValues);
    onSelectionChange(allValues);
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
        {checkboxOptions.map((option) => {
          const key = getOptionKey(option);

          return (
            <CustomCheckboxItem
              key={key}
              option={option}
              selectedCheckboxes={selectedCheckboxes}
              handleCheckboxToggle={handleCheckboxToggle}
              checkboxPosition={checkboxOrientation}
              renderLabel={(label, value) => renderFilterLabel(label, keyValue, value)}
            />
          );
        })}
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
