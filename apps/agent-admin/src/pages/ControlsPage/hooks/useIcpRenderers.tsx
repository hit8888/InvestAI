import { useMemo, useCallback } from 'react';
import { Control, Controller, FieldErrors } from 'react-hook-form';
import { countries as CountriesData, findFlagUrlByCountryName } from 'country-flags-svg';
import MultiSelectDropdown, { OptionType } from '@breakout/design-system/components/Dropdown/MultiSelectDropdown';
import Input from '@breakout/design-system/components/layout/input';
import { ICPFormData, ICPFieldConfig, ICP_FORM_FIELDS } from '../utils';
import { IcpConfigResponse } from '@neuraltrade/core/types/admin/api';

type IcpConfigOptions = IcpConfigResponse['options'];

interface UseIcpRenderersProps {
  control: Control<ICPFormData>;
  errors: FieldErrors<ICPFormData>;
  options: IcpConfigOptions | undefined;
}

export const useIcpRenderers = ({ control, errors, options }: UseIcpRenderersProps) => {
  // Memoized field arrays
  const selectFields = useMemo(() => ICP_FORM_FIELDS.filter((field) => field.fieldType === 'select'), []);

  const numberFields = useMemo(() => ICP_FORM_FIELDS.filter((field) => field.fieldType === 'number'), []);

  // Memoized option item renderer
  const renderOptionItem = useCallback((fieldName: string, option: { value: string; label: string }) => {
    switch (fieldName) {
      case 'seniorities':
      case 'departments':
      case 'person_titles':
        return (
          <span className="max-w-full flex-1 break-words text-gray-500 group-hover:text-gray-900">{option.label}</span>
        );
      case 'locations':
        return (
          <>
            <span className="flex-1 text-gray-500 group-hover:text-gray-900">{option.label}</span>
            <img src={findFlagUrlByCountryName(option.value)} alt={option.label} className="h-4 w-6 rounded" />
          </>
        );
      default:
        return <span className="flex-1 text-gray-500 group-hover:text-gray-900">{option.label}</span>;
    }
  }, []);

  // Memoized field options getter
  const getFieldOptions = useCallback(
    (fieldName: string) => {
      if (!options) return [];

      switch (fieldName) {
        case 'seniorities':
          return options.seniorities || [];
        case 'departments':
          return options.departments || [];
        case 'person_titles':
          return options.person_titles || [];
        case 'locations':
          return CountriesData.map((country) => ({
            value: country.name.toLowerCase(),
            label: country.name,
          }));
        default:
          return [];
      }
    },
    [options],
  );

  // Custom filter logic for different fields
  const getCustomFilter = useMemo(() => {
    // Pre-compute country map for performance
    const countriesByName = new Map(CountriesData.map((c) => [c.name.toLowerCase(), c]));

    const basicFilter = (option: OptionType, searchValue: string): boolean => {
      if (!searchValue.trim()) return true;
      const search = searchValue.toLowerCase().trim();
      // Search in both label and value
      return option.label.toLowerCase().includes(search) || option.value.toLowerCase().includes(search);
    };

    return (fieldName: string) => {
      switch (fieldName) {
        case 'locations':
          // Advanced filtering for locations: search by name, ISO2, ISO3, demonym, and alt spellings
          return (option: OptionType, searchValue: string) => {
            const country = countriesByName.get(option.value);

            if (!country) {
              // Fallback to basic filtering for custom options
              return basicFilter(option, searchValue);
            }

            if (!searchValue.trim()) return true;
            const search = searchValue.toLowerCase().trim();

            const countryNameLower = country.name.toLowerCase();

            // Split country name into words and check if any word starts with search term
            const nameWords = countryNameLower.split(/\s+/);
            const startsWithSearch = nameWords.some((word) => word.startsWith(search));

            // Check alternative spellings (e.g., "UK" for United Kingdom)
            const altSpellings = (country as { altSpellings?: string[] }).altSpellings;
            const altSpellingsMatch = altSpellings?.some((alt: string) => alt.toLowerCase().includes(search)) ?? false;

            // Match against multiple fields for better UX
            return (
              countryNameLower.includes(search) ||
              startsWithSearch ||
              country.iso2.toLowerCase().includes(search) ||
              country.iso3.toLowerCase().includes(search) ||
              (country.demonym && country.demonym.toLowerCase().includes(search)) ||
              altSpellingsMatch
            );
          };

        case 'departments':
        case 'person_titles':
        case 'seniorities':
          // Enhanced filtering for other fields - can be extended later
          return basicFilter;

        default:
          // Return undefined to use default filtering
          return undefined;
      }
    };
  }, []);

  // Memoized dropdown field renderer
  const renderDropdownField = useCallback(
    (field: ICPFieldConfig) => {
      const fieldOptions = getFieldOptions(field.name);
      const customFilter = getCustomFilter(field.name);

      return (
        <div key={field.name} className="flex w-full flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">
            {field.label}{' '}
            {field.maxSelectedCount && <span className="text-xs text-gray-400">(max {field.maxSelectedCount})</span>}
          </label>
          <Controller
            name={field.name}
            control={control}
            render={({ field: { onChange, value } }) => (
              <MultiSelectDropdown
                options={fieldOptions}
                placeholderLabel={field.placeholder}
                selectedValues={Array.isArray(value) ? value : []}
                onSelectionChange={(selectedValues) => {
                  onChange(selectedValues);
                }}
                label={field.label}
                renderOptionItem={(option) => renderOptionItem(field.name, option)}
                renderValueType={field.renderValueType}
                searchable={field.searchable}
                allowCustomOptions={true}
                maxSelections={field.maxSelectedCount ?? Infinity}
                emptyMessage={`No ${field.label} available`}
                searchPlaceholder={field.searchPlaceholder}
                customFilter={customFilter}
              />
            )}
          />
          {errors[field.name] && <p className="mt-1 text-sm text-red-600">{errors[field.name]?.message}</p>}
        </div>
      );
    },
    [control, errors, getFieldOptions, getCustomFilter, renderOptionItem],
  );

  // Memoized number field change handler
  const handleNumberFieldChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>, onChange: (value: number | string) => void, maxValue: number) => {
      const val = e.target.value;
      const parsedVal = val === '' ? '' : parseInt(val, 10);
      if (val === '' || (typeof parsedVal === 'number' && parsedVal <= maxValue)) {
        onChange(parsedVal);
      }
    },
    [],
  );

  // Memoized number field renderer
  const renderNumberField = useCallback(
    (field: ICPFieldConfig) => {
      return (
        <div key={field.name} className="flex w-full flex-col gap-2">
          <label className="text-sm font-medium text-gray-900">
            {field.label}{' '}
            {field.maxSelectedCount && <span className="text-xs text-gray-400">(max {field.maxSelectedCount})</span>}
          </label>
          <Controller
            name={field.name}
            control={control}
            render={({ field: { onChange, value } }) => (
              <Input
                type="number"
                placeholder={field.placeholder}
                value={value === '' ? '' : value}
                onChange={(e) => handleNumberFieldChange(e, onChange, field.maxSelectedCount ?? Infinity)}
                className="h-11 w-full flex-auto rounded-lg border border-gray-300 px-3 py-2 placeholder:text-gray-400 focus:border-none focus:ring-4 focus:ring-gray-200"
              />
            )}
          />
          {errors[field.name] && <p className="mt-1 text-sm text-red-600">{errors[field.name]?.message}</p>}
        </div>
      );
    },
    [control, errors, handleNumberFieldChange],
  );

  return {
    selectFields,
    numberFields,
    renderDropdownField,
    renderNumberField,
  };
};
