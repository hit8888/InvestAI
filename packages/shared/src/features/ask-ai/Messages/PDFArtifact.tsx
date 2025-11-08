import { useState } from 'react';
import {
  PDFAttachmentIcon,
  LucideIcon,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
  cn,
  Typography,
} from '@meaku/saral';
import { usePopoverPortal, useTooltipPortal } from '../../../hooks/usePortal';
import { downloadFromUrl, convertBytesToMB, extractFilenameFromUrl } from '@meaku/core/utils/index';

interface PDFArtifactProps {
  title?: string;
  pdfUrl: string;
  fileSizeInBytes?: number;
  thumbnailImageUrl?: string;
  enablePreview?: boolean;
}

export const PDFArtifact = ({
  title,
  pdfUrl,
  fileSizeInBytes,
  thumbnailImageUrl,
  enablePreview = false,
}: PDFArtifactProps) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const { portalContainer, getZIndexClass } = usePopoverPortal();
  const { portalContainer: tooltipPortalContainer } = useTooltipPortal();

  const displayTitle = title || extractFilenameFromUrl(pdfUrl);
  const fileSize = fileSizeInBytes ? `${convertBytesToMB(fileSizeInBytes)} MB` : '';

  const handleDownload = () => {
    if (pdfUrl) {
      downloadFromUrl(pdfUrl, displayTitle);
    }
    setIsPopoverOpen(false);
  };

  const handleOpenInNewTab = () => {
    if (pdfUrl) {
      window.open(pdfUrl, '_blank');
      setIsPopoverOpen(false);
    }
  };

  return (
    <div className="flex flex-col">
      <div className="bg-gray-50 border border-[#d0d5dd] rounded-[8px] p-[12px] flex flex-col gap-[8px]">
        {/* Header Row */}
        <div className="flex items-start gap-[8px]">
          {/* PDF Icon Container */}
          <div className="bg-[#eaecf0] rounded-[8px] p-[4px] flex items-center justify-center shrink-0 size-[38px]">
            <PDFAttachmentIcon width={22} height={22} />
          </div>

          {/* Document Info */}
          <div className="flex-1 flex flex-col min-w-0">
            <Typography
              className="text-[14px] font-medium text-[#101828] leading-[20px] truncate max-w-[200px]"
              title={displayTitle}
            >
              {displayTitle}
            </Typography>
            {fileSize && (
              <Typography className="text-[12px] font-normal text-[#98a2b3] leading-[18px] truncate">
                {fileSize}
              </Typography>
            )}
          </div>

          {/* Ellipsis Menu Icon with Popover */}
          <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
            <PopoverTrigger asChild>
              <div className="shrink-0 size-[24px] flex items-center justify-center cursor-pointer">
                <LucideIcon name="more-vertical" className="size-[24px] text-gray-600" />
              </div>
            </PopoverTrigger>
            <PopoverContent
              className={cn('bg-white p-[8px] w-auto min-w-0 pointer-events-auto z-50', getZIndexClass())}
              align="start"
              side="top"
              sideOffset={8}
              portalContainer={portalContainer}
              onOpenAutoFocus={(e) => e.preventDefault()}
            >
              <TooltipProvider>
                <div className="flex gap-[8px] items-center">
                  {/* Download Button */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={handleDownload}
                        className="bg-[#eaecf0] rounded-[4px] p-[6px] size-[24px] flex items-center justify-center cursor-pointer hover:bg-[#101828] transition-colors group"
                        aria-label="Download PDF"
                      >
                        <LucideIcon
                          name="download"
                          className="size-[12px] text-gray-900 group-hover:text-white transition-colors"
                        />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent
                      side="top"
                      sideOffset={4}
                      portalContainer={tooltipPortalContainer}
                      className="bg-gray-900 text-white text-xs"
                    >
                      Download
                    </TooltipContent>
                  </Tooltip>

                  {/* Open in New Tab Button */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={handleOpenInNewTab}
                        className="bg-[#eaecf0] rounded-[4px] p-[6px] size-[24px] flex items-center justify-center cursor-pointer hover:bg-[#101828] transition-colors group"
                        aria-label="Open in new tab"
                      >
                        <LucideIcon
                          name="external-link"
                          className="size-[12px] text-gray-900 group-hover:text-white transition-colors"
                        />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent
                      side="top"
                      sideOffset={4}
                      portalContainer={tooltipPortalContainer}
                      className="bg-gray-900 text-white text-xs"
                    >
                      Open in new tab
                    </TooltipContent>
                  </Tooltip>
                </div>
              </TooltipProvider>
            </PopoverContent>
          </Popover>
        </div>

        {/* Thumbnail Image */}
        {enablePreview && thumbnailImageUrl && (
          <div className="w-full h-[200px] overflow-hidden rounded-[8px]">
            <img src={thumbnailImageUrl} alt={displayTitle} className="w-full h-auto object-cover" />
          </div>
        )}
      </div>
    </div>
  );
};

export type { PDFArtifactProps };
