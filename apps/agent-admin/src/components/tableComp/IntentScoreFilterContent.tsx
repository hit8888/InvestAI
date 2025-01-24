import CommonCheckboxesFilterContent from './CommonCheckboxesFilterContent';
import { useAllFilterStore } from '../../stores/useAllFilterStore';
import { FILTER_BY_INTENT_SCORE_CHECKBOX_OPTIONS } from '../../utils/constants';
import { FilterType } from '@meaku/core/types/admin/filters';
import { PageTypeProps } from '../../utils/admin-types';

const IntentScoreFilterContent = ({ page, handleClosePopover }: PageTypeProps & { handleClosePopover: () => void }) => {
  const filters = useAllFilterStore();
  const { IntentScore } = FilterType;
  return (
    <CommonCheckboxesFilterContent
      keyValue={IntentScore}
      checkboxOptions={FILTER_BY_INTENT_SCORE_CHECKBOX_OPTIONS}
      selectedOptions={filters[page].intentScore}
      onSelectionChange={(value) => filters.setFilter(page, IntentScore, value)}
      handleClosePopover={handleClosePopover}
    />
  );
};

export default IntentScoreFilterContent;
