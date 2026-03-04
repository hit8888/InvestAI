import { Search } from 'lucide-react';
import Input from '@breakout/design-system/components/layout/input';
import React, { useState, useEffect, useRef } from 'react';
import { PageTypeProps } from '@neuraltrade/core/types/admin/filters';
import { useAllFilterStore } from '../stores/useAllFilterStore';
import { FilterType } from '@neuraltrade/core/types/admin/filters';
import { useDebouncedValue } from '@neuraltrade/core/hooks/useDebouncedValue';

const { SearchTableContent } = FilterType;

const SearchTableContentInput = ({ page }: PageTypeProps) => {
  const [searchTableContent, setSearchTableContent] = useState('');
  const filters = useAllFilterStore();
  const debouncedValue = useDebouncedValue(searchTableContent, 1000);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (debouncedValue) {
      filters.setFilter(page, SearchTableContent, debouncedValue);
      setSearchTableContent(''); // Clear input after filter is applied
    }
  }, [debouncedValue, page]);

  const handleSearchTableContentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchTableContent(newValue);
    if (newValue === '') {
      filters.setFilter(page, SearchTableContent, ''); // Clear filter when input is empty
    }
  };

  return (
    <div className="relative w-60">
      <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
      <Input
        id={`table-${page}-search-input`}
        placeholder="Search table content..."
        className="w-full border-gray-200 bg-gray-25 pl-10 placeholder:text-gray-400 focus:border-gray-600 focus:ring-gray-600"
        value={searchTableContent}
        onChange={handleSearchTableContentChange}
      />
    </div>
  );
};

export default SearchTableContentInput;
