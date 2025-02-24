import { toast } from 'react-hot-toast';
import { downloadLeadsRowData, downloadConversationRowData } from '../../admin/api';
import { createFilename, triggerDownload } from './downloadUtils';
import { ConversationsPayload, ExportFormat, ExportFormatType, LeadsPayload } from '@meaku/core/types/admin/api';
import { LEADS_PAGE } from '@meaku/core/utils/index';

interface DownloadProps {
  page: string;
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

  try {
    const response =
      page === LEADS_PAGE
        ? await downloadLeadsRowData(payloadData, fileType)
        : await downloadConversationRowData(payloadData, fileType);

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
