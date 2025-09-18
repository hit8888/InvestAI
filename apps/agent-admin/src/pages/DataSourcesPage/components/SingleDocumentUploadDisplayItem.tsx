import DocumentsSourcesIcon from '@breakout/design-system/components/icons/sources-documents-icon';
import { DataSourceItem } from '@meaku/core/types/admin/api';
import { useDataSourcesStore } from '../../../stores/useDataSourcesStore';
import Typography from '@breakout/design-system/components/Typography/index';
import AgentDropdown from '@breakout/design-system/components/Dropdown/AgentDropdown';
import { DOCUMENT_ACCESS_TYPE_OPTIONS } from '../../../utils/constants';

type SingleDocumentUploadDisplayItemProps = {
  item: DataSourceItem | File;
};

const SingleDocumentUploadDisplayItem = ({ item }: SingleDocumentUploadDisplayItemProps) => {
  const { updateDataSource } = useDataSourcesStore();
  const { name, access_type, id } = item as DataSourceItem;

  return (
    <div className="flex w-full items-center justify-between rounded-lg border border-gray-200 bg-white p-2">
      <div className="flex w-full items-center gap-2">
        <div className="flex items-center rounded bg-bluegray-200 p-1">
          <DocumentsSourcesIcon width="16" height="16" className="text-bluegray-700" />
        </div>
        <Typography variant="body-14" className="max-w-lg truncate text-system">
          {name}
        </Typography>
      </div>
      <AgentDropdown
        options={DOCUMENT_ACCESS_TYPE_OPTIONS}
        placeholderLabel="Select Access Type"
        showTooltipContent
        defaultValue={access_type || undefined}
        onCallback={(value) => updateDataSource(id, { access_type: value })}
        fontToShown="text-sm"
        menuContentAlign="end"
        menuContentSide="bottom"
        className="h-8 w-32 justify-center rounded-full border border-gray-200 bg-gray-100 p-2 px-4 text-gray-500"
        dropdownOpenClassName="ring-2 ring-gray-200"
        menuItemClassName="p-2 text-gray-500"
        dropdownIconClassName="text-primary/60"
      />
    </div>
  );
};

export default SingleDocumentUploadDisplayItem;
