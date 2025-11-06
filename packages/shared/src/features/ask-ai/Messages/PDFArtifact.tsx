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
} from '@meaku/saral';
import { PDFArtifactData } from '../../../types/message';
import { usePopoverPortal, useTooltipPortal } from '../../../hooks/usePortal';
interface PDFArtifactProps {
  data: PDFArtifactData;
  enablePreview: boolean;
}

export const PDFArtifact = ({ data, enablePreview = false }: PDFArtifactProps) => {
  const { title = '', pdf_url } = data.content;
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const { portalContainer, getZIndexClass } = usePopoverPortal();
  const { portalContainer: tooltipPortalContainer } = useTooltipPortal();

  // Use default values if not provided or use dummy values for demonstration
  const displayTitle = title || 'HR-as-Change-Agent.pdf';
  const fileSize = (data.metadata?.fileSize as string) || '1.2 MB';
  const thumbnailUrl =
    (data.metadata?.thumbnail_url as string) ||
    'https://www.scribbr.co.uk/wp-content/uploads/2022/08/ieee-example-paper-1.png';

  const handleDownload = () => {
    if (pdf_url) {
      const link = document.createElement('a');
      link.href = pdf_url;
      link.download = displayTitle;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setIsPopoverOpen(false);
    }
  };

  const handleOpenInNewTab = () => {
    if (pdf_url) {
      window.open(pdf_url, '_blank');
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
            <p className="text-[14px] font-medium text-[#101828] leading-[20px] truncate">{displayTitle}</p>
            <p className="text-[12px] font-normal text-[#98a2b3] leading-[18px] truncate">{fileSize}</p>
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
        {enablePreview && thumbnailUrl && (
          <div className="w-full h-[200px] overflow-hidden rounded-[8px]">
            <img src={thumbnailUrl} alt={displayTitle} className="w-full h-auto object-cover" />
          </div>
        )}
      </div>
    </div>
  );
};

export type { PDFArtifactProps };
