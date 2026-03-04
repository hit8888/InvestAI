import { toast } from 'react-hot-toast';
import { exportTableData } from '@neuraltrade/core/adminHttp/api';
import { createFilename, triggerDownload } from './downloadUtils';
import { ConversationsPayload, ExportFormat, ExportFormatType, LeadsPayload } from '@neuraltrade/core/types/admin/api';
import { PageTypeToTableName } from '@neuraltrade/core/utils/index';
import { PaginationPageType } from '@neuraltrade/core/types/admin/admin';

interface DownloadProps {
  page: PaginationPageType;
  selectedOption: ExportFormatType | null;
  payloadData: ConversationsPayload | LeadsPayload;
}
/**
 * Handles the file download process.
 * @param {string} page - The current page (e.g., "LEADS_PAGE" or other).
 * @param {object} payloadData - The payload data for the download API.
 * @param {string} selectedOption - The file type option (e.g., 'csv' or 'xlsx').
 * @returns {boolean} - Returns true if the download is successful, false otherwise.
 */
export const downloadTableData = async ({ page, payloadData, selectedOption }: DownloadProps) => {
  const fileType = (selectedOption?.toLowerCase() as ExportFormatType) || ExportFormat.CSV;

  const tableName = PageTypeToTableName[page];

  if (!tableName) {
    return;
  }

  try {
    const response = await exportTableData(payloadData, fileType, tableName);

    if (response.status !== 200) {
      throw new Error('Download failed');
    }

    // Create a blob from the response data using the returned content-type
    const blob = new Blob([response.data], {
      type: response.headers['content-type'],
    });
    const url = window.URL.createObjectURL(blob);
    const filename = createFilename(page, fileType);

    triggerDownload(url, filename);

    // Cleanup blob URL
    window.URL.revokeObjectURL(url);
    toast.success('Downloaded successfully');
    return true;
  } catch (error) {
    toast.error('Failed to download file');
    console.error('Download error:', error);
    return false;
  }
};
