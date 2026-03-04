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
} from '@neuraltrade/saral';
import { usePopoverPortal, useTooltipPortal } from '../../../hooks/usePortal';
import { downloadFromUrl, convertBytesToMB, extractFilenameFromUrl } from '@neuraltrade/core/utils/index';

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
      <div className="bg-card border border-border rounded-lg p-3 flex flex-col gap-2">
        {/* Header Row */}
        <div className="flex items-start gap-2">
          {/* PDF Icon Container */}
          <div className="bg-muted rounded-lg p-1 flex items-center justify-center shrink-0 w-10 h-10">
            <PDFAttachmentIcon width={28} height={28} />
          </div>

          {/* Document Info */}
          <div className="flex-1 flex flex-col min-w-0">
            <Typography
              className="text-sm font-medium text-foreground leading-5 truncate max-w-[200px]"
              title={displayTitle}
            >
              {displayTitle}
            </Typography>
            {fileSize && (
              <Typography className="text-xs font-normal text-muted-foreground leading-[18px] truncate">
                {fileSize}
              </Typography>
            )}
          </div>

          {/* Ellipsis Menu Icon with Popover */}
          <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
            <PopoverTrigger asChild>
              <div className="shrink-0 w-6 h-6 flex items-center justify-center cursor-pointer">
                <LucideIcon name="more-vertical" className="w-6 h-6 text-muted-foreground" />
              </div>
            </PopoverTrigger>
            <PopoverContent
              className={cn('bg-popover p-2 w-auto min-w-0 pointer-events-auto z-50', getZIndexClass())}
              align="start"
              side="top"
              sideOffset={8}
              portalContainer={portalContainer}
              onOpenAutoFocus={(e) => e.preventDefault()}
            >
              <TooltipProvider>
                <div className="flex gap-2 items-center">
                  {/* Download Button */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={handleDownload}
                        className="bg-muted rounded p-1.5 w-6 h-6 flex items-center justify-center cursor-pointer hover:bg-foreground transition-colors group"
                        aria-label="Download PDF"
                      >
                        <LucideIcon
                          name="download"
                          className="w-3 h-3 text-foreground group-hover:text-white transition-colors"
                        />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent
                      side="top"
                      sideOffset={4}
                      portalContainer={tooltipPortalContainer}
                      className="bg-foreground text-white text-xs"
                    >
                      Download
                    </TooltipContent>
                  </Tooltip>

                  {/* Open in New Tab Button */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={handleOpenInNewTab}
                        className="bg-muted rounded p-1.5 w-6 h-6 flex items-center justify-center cursor-pointer hover:bg-foreground transition-colors group"
                        aria-label="Open in new tab"
                      >
                        <LucideIcon
                          name="external-link"
                          className="w-3 h-3 text-foreground group-hover:text-white transition-colors"
                        />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent
                      side="top"
                      sideOffset={4}
                      portalContainer={tooltipPortalContainer}
                      className="bg-foreground text-white text-xs"
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
          <div className="w-full h-[200px] overflow-hidden rounded-lg">
            <img src={thumbnailImageUrl} alt={displayTitle} className="w-full h-auto object-cover" />
          </div>
        )}
      </div>
    </div>
  );
};

export type { PDFArtifactProps };
