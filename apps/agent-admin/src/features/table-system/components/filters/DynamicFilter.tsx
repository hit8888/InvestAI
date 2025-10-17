import type { FilterConfig, DateRangeValue, FilterValues } from '../../types';
import { SearchFilter } from './SearchFilter';
import { MultiSelectFilter } from './MultiSelectFilter';
import { DateRangeFilter } from './DateRangeFilter';

interface DynamicFilterProps {
  config: FilterConfig;
  value: unknown;
  onChange: (value: unknown) => void;
  allFilters?: FilterValues;
  defaultFilters?: Record<string, unknown>;
  tableData?: unknown[];
  filterOptionsEndpoint?: string;
  onBack?: () => void;
  onApply?: () => void;
}

/**
 * Renders the appropriate filter component based on filter type
 */
export const DynamicFilter = ({
  config,
  value,
  onChange,
  allFilters = {},
  defaultFilters = {},
  tableData = [],
  filterOptionsEndpoint,
  onBack = () => {},
  onApply = () => {},
}: DynamicFilterProps) => {
  switch (config.type) {
    case 'search':
    case 'text':
      return (
        <SearchFilter
          value={String(value || '')}
          onChange={onChange}
          placeholder={config.placeholder || `Search ${config.label.toLowerCase()}...`}
        />
      );

    case 'multi-select':
      return (
        <MultiSelectFilter
          config={config}
          value={Array.isArray(value) ? value.map(String) : null}
          allFilters={allFilters}
          defaultFilters={defaultFilters}
          tableData={tableData}
          filterOptionsEndpoint={filterOptionsEndpoint}
          onChange={onChange}
        />
      );

    case 'date-range':
      return (
        <DateRangeFilter
          config={config}
          value={(value as DateRangeValue) || null}
          onChange={onChange}
          onBack={onBack}
          onApply={onApply}
        />
      );

    default:
      console.warn(`[DynamicFilter] Unsupported filter type: ${config.type}`);
      return null;
  }
};
