import { SdrAssignment } from '@meaku/core/types/admin/api';

export interface Option {
  value: string;
  label: string;
}

export type CheckboxValue = string | SdrAssignment;
export type CheckboxOption = Option | SdrAssignment;

/**
 * Determines if an option is checked by comparing it with the selected values
 * Handles both string and SdrAssignment types correctly
 */
export const isOptionChecked = (option: CheckboxOption, selectedValues: CheckboxValue[]): boolean => {
  return selectedValues.some((selected) => {
    // Both are strings (Option type)
    if (typeof selected === 'string' && 'value' in option) {
      return selected === option.value;
    }
    // Both are objects (SdrAssignment type) - compare by id
    if (typeof selected === 'object' && 'id' in option) {
      return selected?.id === option?.id;
    }
    return false;
  });
};

/**
 * Gets the value to use for toggle operations based on option type
 * Returns string for Option type, returns the whole object for SdrAssignment type
 */
export const getToggleValue = (option: CheckboxOption): CheckboxValue => {
  if ('value' in option) {
    // Option type - return only the value string
    return option.value;
  } else {
    // SdrAssignment type - return the whole object
    return option;
  }
};

/**
 * Generates a unique key for the option
 * Uses id for SdrAssignment, value for Option
 */
export const getOptionKey = (option: CheckboxOption): string => {
  if (typeof option === 'object' && 'id' in option) {
    return option.id?.toString() ?? '';
  }
  return (option as Option).value;
};

/**
 * Handles checkbox toggle logic for both string and SdrAssignment types
 * Returns the new selection array after toggling the specified value
 */
export const handleCheckboxToggle = (value: CheckboxValue, currentSelection: CheckboxValue[]): CheckboxValue[] => {
  // Handle comparison based on type
  if (typeof value === 'string') {
    const isSelected = currentSelection.some((item) => typeof item === 'string' && item === value);
    return isSelected
      ? currentSelection.filter((item) => (typeof item === 'string' ? item !== value : true))
      : [...currentSelection, value];
  } else {
    // SdrAssignment case - compare by id
    const isSelected = currentSelection.some((item) => typeof item === 'object' && item?.id === value?.id);
    return isSelected
      ? currentSelection.filter((item) => (typeof item === 'object' ? item?.id !== value?.id : true))
      : [...currentSelection, value];
  }
};

/**
 * Maps checkbox options to their toggle values
 * Useful for select all operations
 */
export const mapOptionsToValues = (options: CheckboxOption[]): CheckboxValue[] => {
  return options.map((option) => getToggleValue(option));
};
