import React, { useMemo, useState } from 'react';
import { useAllFilterStore } from '../../stores/useAllFilterStore';
import CommonCheckboxesFilterContent from './CommonCheckboxesFilterContent';
import CrossIcon from '@breakout/design-system/components/icons/cross-icon';
import Input from '@breakout/design-system/components/layout/input';
import { PageTypeProps } from '../../utils/admin-types';
import { FilterType } from '@meaku/core/types/admin/filters';
import { FilterOptionsPayload } from '@meaku/core/types/admin/api';
import { getAllFilterAppliedValues, getTenantFromLocalStorage } from '../../utils/common';
import useFilterOptionsDataQuery from '../../queries/query/useFilterOptionsDataQuery';
import { keepPreviousData } from '@tanstack/react-query';

const LocationFilterContent = ({ page, handleClosePopover }: PageTypeProps & { handleClosePopover: () => void }) => {
  const tenantName = getTenantFromLocalStorage();
  const filters = useAllFilterStore();
  const { Location } = FilterType;
  const [searchTerm, setSearchTerm] = useState('');

  const filtersOptionsPayload = useMemo(() => {
    return getAllFilterAppliedValues(filters[page], page).filter((filter) => filter.field !== 'country');
  }, [filters[page], page]);

  const payloadData: FilterOptionsPayload = {
    filters: filtersOptionsPayload,
    field: 'country',
    search: searchTerm,
  };

  const { data, isLoading, isError } = useFilterOptionsDataQuery({
    payload: payloadData,
    tenantName: tenantName || '',
    page: page,
    queryOptions: {
      enabled: !!tenantName,
      placeholderData: keepPreviousData,
    },
  });
  // console.log("location options data", data)
  const locationOptions = useMemo(
    () =>
      data?.values.filter(Boolean).map((value) => ({
        value: value,
        label: value,
      })) || [],
    [data?.values],
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const clearSearchTerm = () => {
    setSearchTerm('');
  };

  const hasSearchTermLength = searchTerm.length > 0;

  if (!data) return null;
  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>No Location data</div>;
  return (
    <React.Fragment key={Location}>
      <div className="border-b border-gray-300 px-4 pb-4">
        <div className="flex">
          <Input
            className="rounded-lg border border-gray-300 bg-gray-50 px-4 py-3"
            onChange={handleInputChange}
            value={searchTerm}
            maxLength={20}
            placeholder="Enter Country Name..."
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
        handleClosePopover={handleClosePopover}
        keyValue={Location}
        checkboxOptions={locationOptions || []}
        isLocationFilter={true}
        selectedOptions={filters[page].location}
        onSelectionChange={(value) => filters.setFilter(page, Location, value)}
      />
    </React.Fragment>
  );
};

export default LocationFilterContent;
