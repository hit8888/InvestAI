import { useState } from 'react';
import { Download, X } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  PopoverClose,
} from '@breakout/design-system/components/Popover/index';
import { RadioGroup, RadioGroupItem, RadioIndicator } from '@breakout/design-system/components/shadcn-ui/radio-group';
import Button from '@breakout/design-system/components/Button/Button';
import type { ExportFormatType } from '@neuraltrade/core/types/admin/api';

interface GenericTableExportDownloadProps {
  /** Available export formats */
  formats?: ('csv' | 'xlsx')[];
  /** Default format */
  defaultFormat?: 'csv' | 'xlsx';
  /** Handler called when export is triggered */
  onExport: (format: ExportFormatType) => Promise<boolean>;
  /** Optional custom label */
  label?: string;
}

/**
 * Generic export/download component for v2 tables
 * Built with design system primitives for consistency
 */
export const GenericTableExportDownload = ({
  formats = ['csv', 'xlsx'],
  defaultFormat = 'csv',
  onExport,
  label = 'Download',
}: GenericTableExportDownloadProps) => {
  const [selectedFormat, setSelectedFormat] = useState<ExportFormatType>(
    defaultFormat.toUpperCase() as ExportFormatType,
  );
  const [isOpen, setIsOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    if (!selectedFormat || isExporting) return;

    setIsExporting(true);
    try {
      const success = await onExport(selectedFormat);
      if (success) {
        setIsOpen(false);
      }
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button
          className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          aria-label="Download table data"
          title="Download table data"
        >
          <Download className="h-4 w-4" />
        </button>
      </PopoverTrigger>

      <PopoverContent
        className="z-[100] w-80 rounded-lg border border-gray-200 bg-white p-0 shadow-lg"
        align="end"
        side="bottom"
        sideOffset={8}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
          <h3 className="text-sm font-semibold text-gray-900">{label}</h3>
          <PopoverClose asChild>
            <button
              className="rounded-md p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </PopoverClose>
        </div>

        {/* Format Selection */}
        <div className="p-4">
          <RadioGroup value={selectedFormat} onValueChange={(value) => setSelectedFormat(value as ExportFormatType)}>
            <div className="space-y-2">
              {formats.map((format) => {
                const formatValue = format.toUpperCase() as ExportFormatType;

                return (
                  <label key={format} className="flex cursor-pointer items-center gap-3 py-2">
                    <RadioGroupItem value={formatValue} className="h-4 w-4 border-2 border-gray-300">
                      <RadioIndicator asChild>
                        <div className="flex h-full w-full items-center justify-center">
                          <div className="h-2 w-2 rounded-full bg-primaryV2" />
                        </div>
                      </RadioIndicator>
                    </RadioGroupItem>
                    <span className="text-sm text-gray-700">Export to {format.toUpperCase()}</span>
                  </label>
                );
              })}
            </div>
          </RadioGroup>
        </div>

        {/* Footer */}
        <div className="flex justify-end border-t border-gray-200 px-4 py-3">
          <Button
            variant="system_secondary"
            size="small"
            onClick={handleExport}
            disabled={!selectedFormat || isExporting}
            // className="w-full"
          >
            <Download className="h-4 w-4" />
            {isExporting ? 'Downloading...' : label}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
