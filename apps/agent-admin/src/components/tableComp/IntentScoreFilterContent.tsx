import CommonCheckboxesFilterContent from './CommonCheckboxesFilterContent';
import { useAllFilterStore } from '../../stores/useAllFilterStore';
import { FILTER_BY_INTENT_SCORE_CHECKBOX_OPTIONS } from '../../utils/constants';
import { CommonFilterContentProps, FilterType } from '@meaku/core/types/admin/filters';
import { useCallback } from 'react';
import { CheckboxValue } from '../../utils/checkboxUtils';

const IntentScoreFilterContent = ({ page, handleClosePopover, filterState }: CommonFilterContentProps) => {
  const filters = useAllFilterStore((state) => state[page]);
  const setFilter = useAllFilterStore((state) => state.setFilter);
  const { IntentScore } = FilterType;

  const intentScore = filters.intentScore;

  const handleSelectionChange = useCallback(
    (value: CheckboxValue[]) => {
      setFilter(page, IntentScore, value);
    },
    [page, IntentScore, setFilter],
  );

  return (
    <CommonCheckboxesFilterContent
      filterState={filterState}
      keyValue={IntentScore}
      checkboxOptions={FILTER_BY_INTENT_SCORE_CHECKBOX_OPTIONS}
      selectedOptions={intentScore}
      onSelectionChange={handleSelectionChange}
      handleClosePopover={handleClosePopover}
    />
  );
};

export default IntentScoreFilterContent;
