import React, { useMemo, useState } from 'react';
import { useAllFilterStore } from '../../stores/useAllFilterStore';
import CommonCheckboxesFilterContent from './CommonCheckboxesFilterContent';
import CrossIcon from '@breakout/design-system/components/icons/cross-icon';
import Input from '@breakout/design-system/components/layout/input';
import { FilterType, CommonFilterContentProps } from '@meaku/core/types/admin/filters';
import { FilterOptionsPayload } from '@meaku/core/types/admin/api';
import { getAllFilterAppliedValues, getDescendingOrderedOptions } from '../../utils/common';
import useFilterOptionsDataQuery from '../../queries/query/useFilterOptionsDataQuery';
import { useTableStore } from '../../stores/useTableStore';
import { useDebouncedValue } from '@meaku/core/hooks/useDebouncedValue';
import { useQueryOptions } from '../../hooks/useQueryOptions';
import FilterOptionsShimmer from '../ShimmerComponent/FilterOptionsShimmer';

const CompanyFilterContent = ({ page, filterState, handleClosePopover }: CommonFilterContentProps) => {
  const filters = useAllFilterStore();
  const tableManager = useTableStore((state) => state.tableManager);
  const { Company } = FilterType;
  const [searchTerm, setSearchTerm] = useState('');

  const filtersOptionsPayload = useMemo(() => {
    return getAllFilterAppliedValues(filters[page], page).filter((filter) => filter.field !== 'company');
  }, [filters[page], page]);

  const payloadData: FilterOptionsPayload = {
    filters: filtersOptionsPayload,
    field: 'company',
    search: searchTerm,
  };

  // Use debounced payload to prevent excessive API calls
  const debouncedPayloadData = useDebouncedValue(payloadData);
  const queryOptions = useQueryOptions();

  const { data, isLoading, isError } = useFilterOptionsDataQuery({
    payload: debouncedPayloadData,
    page: page,
    queryOptions,
  });

  const sortedCompanies: string[] = tableManager?.getSortedItemsByKey('company') ?? [];
  const companyValues: string[] = data?.values.filter(Boolean) ?? [];

  const resultantOptions = getDescendingOrderedOptions(searchTerm ? [] : sortedCompanies, companyValues);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const clearSearchTerm = () => {
    setSearchTerm('');
  };

  const hasSearchTermLength = searchTerm.length > 0;

  if (isLoading) return <FilterOptionsShimmer checkboxOrientation="right" />;
  if (isError) return <div>No Company data</div>;
  if (!data) return null;
  return (
    <React.Fragment key={Company}>
      <div className="px-4">
        <div className="flex">
          <Input
            className="rounded-lg border border-gray-300 bg-gray-50 px-4 py-3"
            onChange={handleInputChange}
            value={searchTerm}
            maxLength={20}
            placeholder="Enter Company Name..."
          />
          {hasSearchTermLength ? (
            <button
              type="button"
              aria-label="clear button"
              className="relative right-8 top-1.5 flex h-6 w-6 cursor-pointer items-center justify-center"
              onClick={clearSearchTerm}
            >
              <CrossIcon width={'20'} height={'20'} className="text-primary" />
            </button>
          ) : null}
        </div>
      </div>
      <CommonCheckboxesFilterContent
        filterState={filterState}
        handleClosePopover={handleClosePopover}
        keyValue={Company}
        checkboxOptions={resultantOptions || []}
        checkboxOrientation="right"
        selectedOptions={filters[page].company}
        onSelectionChange={(value) => filters.setFilter(page, Company, value)}
      />
    </React.Fragment>
  );
};

export default CompanyFilterContent;
