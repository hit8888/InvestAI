import { PageTypeProps } from '@neuraltrade/core/types/admin/filters';
import AllFiltersContainer from './tableComp/AllFilters';
import { ConversationsPayload, LeadsPayload, DataSourcePayload } from '@neuraltrade/core/types/admin/api';
import TableFiltersWithHeaderLabelShimmer from './ShimmerComponent/TableFiltersWithHeaderLabelShimmer';
import { useFiltersContainerHeight } from '../hooks/useFiltersContainerHeight';
import { useEffect } from 'react';
import ExportDownload from './tableComp/ExportDownload';
import SearchTableContentInput from './SearchTableContentInput';
import { TOP_HEADER_CONTAINER_HEIGHT_WITH_PADDING } from '../utils/constants';
import { cn } from '@breakout/design-system/lib/cn';

type IProps = PageTypeProps & {
  disabledState?: boolean;
  isLoading: boolean;
  payloadData: ConversationsPayload | LeadsPayload | DataSourcePayload;
  onFiltersContainerHeightChange?: (height: number) => void;
  allowExportDownload?: boolean;
  className?: string;
  showFilterBar?: boolean;
};

const TableFiltersWithHeaderLabel = ({
  page,
  disabledState,
  payloadData,
  isLoading,
  onFiltersContainerHeightChange,
  allowExportDownload = true,
  showFilterBar = true,
  className,
}: IProps) => {
  const { filtersRef, height } = useFiltersContainerHeight();

  // Notify parent component of height changes
  useEffect(() => {
    if (onFiltersContainerHeightChange) {
      onFiltersContainerHeightChange(height + TOP_HEADER_CONTAINER_HEIGHT_WITH_PADDING);
    }
  }, [height, onFiltersContainerHeightChange]);

  if (isLoading) {
    return <TableFiltersWithHeaderLabelShimmer />;
  }

  if (disabledState) return null;
  return (
    <div
      ref={filtersRef}
      className={cn('sticky z-10 flex w-full items-start justify-between self-stretch bg-white py-4', className)}
      style={{
        top: `${TOP_HEADER_CONTAINER_HEIGHT_WITH_PADDING}px`,
      }}
    >
      <FlexContainer>
        <AllFiltersContainer page={page} showSearchBar={false} showFilterBar={showFilterBar} />
      </FlexContainer>
      <FlexContainer>
        <SearchTableContentInput page={page} />
        {allowExportDownload && <ExportDownload page={page} payloadData={payloadData} />}
      </FlexContainer>
    </div>
  );
};

const FlexContainer = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex w-fit items-center justify-end gap-4">{children}</div>;
};

export default TableFiltersWithHeaderLabel;
