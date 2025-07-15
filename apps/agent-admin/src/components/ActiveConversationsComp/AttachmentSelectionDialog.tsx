import { LoaderCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@breakout/design-system/components/layout/dialog';
import Typography from '@breakout/design-system/components/Typography/index';
import DataSourcePdfIcon from '@breakout/design-system/components/icons/data-source-pdf-icon';
import CalendarIcon from '@breakout/design-system/components/icons/calendar-icon';
import { CalendarResponse } from '@meaku/core/types/admin/api';
import { DataSourceDocumentsResponseResult } from '@meaku/core/types/admin/api';
import { DataSourceDocumentsTableResponse } from '@meaku/core/types/admin/admin';
import useDataSourceTableViewQuery from '../../queries/query/useDataSourceTableViewQuery';
import useCalendars from '../../queries/query/useCalendarsQuery';
import useMyCalendars from '../../queries/query/useMyCalendarQueries';
import { DOCUMENTS_PAGE } from '@meaku/core/utils/index';
import { SendAdminMessageFn } from '../../hooks/useAdminConversationWebSocket';
import { ActiveConversationAttachmentOption } from '../../utils/admin-types';

type AttachmentSelectionDialogProps = {
  selectedOption: ActiveConversationAttachmentOption;
  onSendMessage: SendAdminMessageFn;
  onClose: () => void;
};

const AttachmentSelectionDialog = ({ selectedOption, onSendMessage, onClose }: AttachmentSelectionDialogProps) => {
  const { data: calendarsData, isLoading: isCalendarsLoading } = useCalendars({
    enabled: selectedOption === 'all-calendar',
  });
  const { data: myCalendarsData, isLoading: isMyCalendarsLoading } = useMyCalendars({
    enabled: selectedOption === 'my-calendar',
  });
  const { data, isLoading: isDocumentsLoading } = useDataSourceTableViewQuery({
    payload: {
      page: 1,
      page_size: 10,
      search: '',
      sort: [],
      filters: [],
    },
    queryOptions: {
      enabled: selectedOption === 'document',
    },
    tableKey: DOCUMENTS_PAGE,
  });

  const documentsResponse = data as DataSourceDocumentsTableResponse;
  const documentsData = documentsResponse?.results as DataSourceDocumentsResponseResult[];
  const isLoading = isDocumentsLoading || isMyCalendarsLoading || isCalendarsLoading;
  const isOpen = !!selectedOption;

  const handleItemSelect = (itemType: string, itemData: DataSourceDocumentsResponseResult | CalendarResponse) => {
    onClose();

    if (!itemData) return;

    if (itemType === 'document') {
      const document = itemData as DataSourceDocumentsResponseResult;
      onSendMessage({
        content: `Admin has shared a document [${document.asset?.name}](${document.asset?.public_url}) with you`,
        event_data: {
          type: 'document',
          url: document.asset?.public_url,
        },
      });
      return;
    }

    const calendar = itemData as CalendarResponse;
    onSendMessage({
      content: '',
      event_data: {
        type: 'calendar',
        calendar_id: calendar.id,
      },
    });
  };
  const renderFallback = () => {
    return (
      <div className="flex flex-col items-center justify-center">
        <Typography variant="body-14" textColor="textPrimary">
          No items found
        </Typography>
      </div>
    );
  };

  const renderDocuments = () => {
    if (!documentsData || documentsData.length === 0) {
      return renderFallback();
    }

    return documentsData.map((document) => (
      <div
        key={document.id}
        className="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-2 hover:bg-gray-50"
        onClick={() => handleItemSelect(selectedOption, document)}
      >
        <DataSourcePdfIcon color="#9590EA" width="20" height="20" />
        <Typography variant="body-14" textColor="textPrimary" className="flex-grow">
          {document.asset?.name}
        </Typography>
      </div>
    ));
  };

  const renderCalendars = () => {
    const calendarData = selectedOption === 'my-calendar' ? myCalendarsData : calendarsData;

    if (!calendarData || calendarData.length === 0) {
      return renderFallback();
    }

    return calendarData.map((calendar) => (
      <div
        key={calendar.id}
        className="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-2 hover:bg-gray-50"
        onClick={() => handleItemSelect(selectedOption, calendar)}
      >
        <CalendarIcon color="#9590EA" width="20" height="20" />
        <Typography variant="body-14" textColor="textPrimary" className="flex-grow">
          {calendar.name}
        </Typography>
      </div>
    ));
  };

  const getDialogTitle = () => {
    switch (selectedOption) {
      case 'document':
        return 'Select Document';
      case 'my-calendar':
      case 'all-calendar':
        return 'Select Calendar';
      default:
        return 'Select Item';
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center">
          <LoaderCircle size={24} className="animate-spin text-primary" />
        </div>
      );
    }

    switch (selectedOption) {
      case 'document':
        return renderDocuments();
      case 'my-calendar':
      case 'all-calendar':
        return renderCalendars();
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="z-[100001] flex flex-col bg-white p-4">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <Typography variant="title-18" textColor="textPrimary">
              {getDialogTitle()}
            </Typography>
          </DialogTitle>
        </DialogHeader>
        <div className="flex-grow overflow-y-auto">{renderContent()}</div>
      </DialogContent>
    </Dialog>
  );
};

export default AttachmentSelectionDialog;
