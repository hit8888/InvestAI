import { PageTypeProps } from '@meaku/core/types/admin/filters';
import AllFiltersContainer from './tableComp/AllFilters';
import SortFilter from './tableComp/SortFilter';
import { ConversationsPayload, LeadsPayload, DataSourcePayload } from '@meaku/core/types/admin/api';
import TableFiltersWithHeaderLabelShimmer from './ShimmerComponent/TableFiltersWithHeaderLabelShimmer';
import { useFiltersContainerHeight } from '../hooks/useFiltersContainerHeight';
import { useEffect } from 'react';
import ExportDownload from './tableComp/ExportDownload';
import SearchTableContentInput from './SearchTableContentInput';
import { CONVERSATIONS_PAGE, LEADS_PAGE, LINK_CLICKS_PAGE } from '@meaku/core/utils/index';
import { CONVERSATION_TABS_CONTAINER_HEIGHT_WITH_PADDING } from '../utils/constants';

const CONVERSATION_TABS_CONTAINER_HEIGHT = 58;

type IProps = PageTypeProps & {
  disabledState?: boolean;
  isLoading: boolean;
  payloadData: ConversationsPayload | LeadsPayload | DataSourcePayload;
  onFiltersContainerHeightChange?: (height: number) => void;
};

const TableFiltersWithHeaderLabel = ({
  page,
  disabledState,
  payloadData,
  isLoading,
  onFiltersContainerHeightChange,
}: IProps) => {
  const { filtersRef, height } = useFiltersContainerHeight();

  // Notify parent component of height changes
  useEffect(() => {
    if (onFiltersContainerHeightChange) {
      onFiltersContainerHeightChange(height + CONVERSATION_TABS_CONTAINER_HEIGHT);
    }
  }, [height, onFiltersContainerHeightChange]);

  if (isLoading) {
    return <TableFiltersWithHeaderLabelShimmer />;
  }

  if (disabledState) return null;
  const isLeadsAndConversationsPage = page === LEADS_PAGE || page === CONVERSATIONS_PAGE || page === LINK_CLICKS_PAGE;
  return (
    <div
      ref={filtersRef}
      className={`sticky top-[${CONVERSATION_TABS_CONTAINER_HEIGHT_WITH_PADDING}px] z-10 flex w-full items-start justify-between self-stretch bg-white py-4`}
    >
      <FlexContainer>
        <AllFiltersContainer page={page} isLeadsAndConversationsPage={isLeadsAndConversationsPage} />
        <SortFilter page={page} key={page} disabledState={disabledState} />
      </FlexContainer>
      <FlexContainer>
        <SearchTableContentInput page={page} />
        {isLeadsAndConversationsPage && <ExportDownload page={page} payloadData={payloadData} />}
      </FlexContainer>
    </div>
  );
};

const FlexContainer = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex w-fit items-center justify-end gap-4">{children}</div>;
};

export default TableFiltersWithHeaderLabel;
