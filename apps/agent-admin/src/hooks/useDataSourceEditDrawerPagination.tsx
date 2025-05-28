import { useState } from 'react';

const useDataSourceEditDrawerPagination = (totalItems: number) => {
  const [itemIndex, setItemIndex] = useState(0);
  const isFirstItem = itemIndex === 0;
  const isLastItem = itemIndex === totalItems - 1;

  const handleNextItem = () => {
    if (isLastItem) return;
    setItemIndex(itemIndex + 1);
  };

  const handlePreviousItem = () => {
    if (isFirstItem) return;
    setItemIndex(itemIndex - 1);
  };

  return { itemIndex, handleNextItem, handlePreviousItem, isFirstItem, isLastItem };
};

export default useDataSourceEditDrawerPagination;
