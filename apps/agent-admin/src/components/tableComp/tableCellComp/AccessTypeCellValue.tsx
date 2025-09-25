import AgentDropdown from '@breakout/design-system/components/Dropdown/AgentDropdown';
import { DOCUMENT_ACCESS_TYPE_OPTIONS } from '../../../utils/constants';
import { useMemo } from 'react';
import { useUpdateDocumentAccessType } from '../../../queries/mutation/useDocumentMutation';
import SuccessToastMessage from '@breakout/design-system/components/layout/SuccessToastMessage';
import ErrorToastMessage from '@breakout/design-system/components/layout/ErrorToastMessage';
import { AccessTypeValue } from '@meaku/core/types/admin/admin-table';
import { DATA_SOURCE_TYPE_ENUM } from '@meaku/core/utils/index';

const AccessTypeCellValue = ({ value }: { value: AccessTypeValue }) => {
  const { id, access_type, file_type } = value;
  const { mutateAsync: updateAccessType, isPending } = useUpdateDocumentAccessType();

  const handleCallback = async (value: string | null) => {
    if (!value || !DOCUMENT_ACCESS_TYPE_OPTIONS.some((option) => option.value === value) || isPending) {
      return;
    }

    try {
      await updateAccessType({
        documentId: id,
        accessType: value as 'INTERNAL' | 'EXTERNAL',
      });
      SuccessToastMessage({
        title: 'Document access type updated successfully',
        position: 'top-center',
      });
    } catch {
      ErrorToastMessage({
        title: 'Failed to update document access type',
      });
    }
  };

  // Prevent any click events on the dropdown container from propagating to the table row
  const handleContainerClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const defaultValue = useMemo(() => {
    return DOCUMENT_ACCESS_TYPE_OPTIONS.find((option) => option.value === access_type.toUpperCase()) || undefined;
  }, [access_type]);

  const isFileTypeCustomDocument = file_type === DATA_SOURCE_TYPE_ENUM.CUSTOM_DOCUMENT;

  return (
    <div onClick={handleContainerClick} onMouseDown={handleContainerClick}>
      <AgentDropdown
        disableTrigger={isFileTypeCustomDocument}
        options={DOCUMENT_ACCESS_TYPE_OPTIONS}
        placeholderLabel="Select Access Type"
        showTooltipContent
        defaultValue={defaultValue}
        onCallback={(value) => handleCallback(value)}
        fontToShown="text-sm"
        menuContentAlign="end"
        menuContentSide="bottom"
        className="h-6.5 w-28 justify-center rounded-full border border-gray-200 bg-gray-100 px-1 py-0.5 text-gray-500"
        dropdownOpenClassName="ring-2 ring-gray-200"
        menuItemClassName="p-2 text-gray-500"
        dropdownIconClassName="text-primary/60"
      />
    </div>
  );
};

export default AccessTypeCellValue;
