import { cn } from '@breakout/design-system/lib/cn';
import { Paperclip, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from '@breakout/design-system/components/Popover/index';
import Typography from '@breakout/design-system/components/Typography/index';
import DataSourcePdfIcon from '@breakout/design-system/components/icons/data-source-pdf-icon';
import CalendarIcon from '@breakout/design-system/components/icons/calendar-icon';
import CloseIcon from '@breakout/design-system/components/icons/popup-close-icon';
import { ActiveConversationAttachmentOption } from '../../utils/admin-types';

type AttachmentPopoverProps = {
  onAttachmentOptionSelect: (option: ActiveConversationAttachmentOption) => void;
  disabled?: boolean;
};

const AttachmentPopover = ({ onAttachmentOptionSelect, disabled = false }: AttachmentPopoverProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const handleOpenChange = (open: boolean) => {
    if (disabled) return;
    setIsOpen(open);
    if (!open) {
      setIsCalendarOpen(false);
    }
  };

  const handleAttachmentOptionClick = (option: ActiveConversationAttachmentOption) => {
    setIsOpen(false);
    onAttachmentOptionSelect(option);
  };

  const handleClose = () => {
    setIsOpen(false);
    setIsCalendarOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <div
          className={cn(
            'flex h-9 w-9 items-center justify-center rounded-md border border-gray-200 bg-gray-25 p-1',
            disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:bg-gray-50',
          )}
        >
          <Paperclip size={16} className={cn('-rotate-45 text-gray-600', disabled && 'text-gray-400')} />
        </div>
      </PopoverTrigger>
      <PopoverContent
        className="popover-boxshadow z-[100000] w-56 rounded-lg bg-white p-0"
        align="end"
        side="top"
        sideOffset={8}
        onPointerDownOutside={handleClose}
      >
        <div className="flex flex-col">
          <div className="flex items-center justify-between px-4 py-3">
            <Typography variant="title-18" textColor="textPrimary">
              Attach
            </Typography>
            <PopoverClose asChild>
              <CloseIcon className="cursor-pointer text-gray-500" width={16} height={16} />
            </PopoverClose>
          </div>
          <Typography
            variant="body-14"
            textColor="textPrimary"
            className="flex cursor-pointer items-center gap-2 rounded-sm p-4 hover:bg-gray-50"
            onClick={() => handleAttachmentOptionClick(ActiveConversationAttachmentOption.DOCUMENT)}
          >
            <DataSourcePdfIcon color="#9590EA" width="20" height="20" />
            Document
          </Typography>
          <div
            className="flex cursor-pointer items-center justify-between rounded-sm p-4 hover:bg-gray-50"
            onClick={() => setIsCalendarOpen(!isCalendarOpen)}
          >
            <Typography variant="body-14" textColor="textPrimary" className="flex items-center gap-2">
              <CalendarIcon color="#9590EA" width="20" height="20" />
              Calendar
            </Typography>
            {isCalendarOpen ? (
              <ChevronUp size={16} className="text-primary" />
            ) : (
              <ChevronDown size={16} className="text-primary" />
            )}
          </div>
          {isCalendarOpen && (
            <div className="flex flex-col">
              <Typography
                variant="body-14"
                textColor="gray500"
                className="flex cursor-pointer items-center gap-2 rounded-sm p-4 pl-12 hover:bg-gray-50"
                onClick={() => handleAttachmentOptionClick(ActiveConversationAttachmentOption.MY_CALENDAR)}
              >
                My Calendar
              </Typography>
              <Typography
                variant="body-14"
                textColor="gray500"
                className="flex cursor-pointer items-center gap-2 rounded-sm p-4 pl-12 hover:bg-gray-50"
                onClick={() => handleAttachmentOptionClick(ActiveConversationAttachmentOption.ALL_CALENDAR)}
              >
                All Calendar
              </Typography>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default AttachmentPopover;
