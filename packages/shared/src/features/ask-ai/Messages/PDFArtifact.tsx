import { useState } from 'react';
import { Button } from '@meaku/saral';
import { PDFArtifactData } from '../../../types/message';

interface PDFArtifactProps {
  data: PDFArtifactData;
}

/**
 * PDFArtifact component that displays a PDF preview
 * Shows a PDF icon, title, file size, and description
 * Allows users to view or download the PDF
 */
export const PDFArtifact = ({ data }: PDFArtifactProps) => {
  const { title = '', pdf_url, description = '' } = data.content;
  const [isLoading, setIsLoading] = useState(false);
  
  // Use a default title if none is provided
  const displayTitle = title || 'PDF Document';
  
  const handleOpenPDF = () => {
    // Open the PDF in a new tab
    window.open(pdf_url, '_blank');
    setIsLoading(true);
    
    // Reset loading state after a delay
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="w-full rounded-lg overflow-hidden border border-gray-200 bg-white shadow-sm">
      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* PDF Icon */}
          <div className="flex-shrink-0">
            <div className="w-10 h-12 bg-red-100 flex items-center justify-center rounded-sm">
              <div className="text-red-600 text-xs font-semibold">PDF</div>
            </div>
          </div>

          {/* Document Info */}
          <div className="flex-grow">
            <h3 className="text-base font-medium text-gray-900 mb-1">{displayTitle}</h3>
            {data.content.id && (
              <div className="text-sm text-gray-500 mb-1">
                {/* Show file size if available */}
                {data.metadata?.fileSize ? 
                  <span>{data.metadata.fileSize}</span> : 
                  <span>PDF Document</span>
                }
              </div>
            )}
          </div>
        </div>

        {/* PDF Preview */}
        {pdf_url && (
          <div className="mt-4 border border-gray-200 rounded bg-gray-50 p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700 line-clamp-1">
                {displayTitle}
              </div>
              <Button 
                onClick={handleOpenPDF}
                disabled={isLoading}
                variant="default"
                className="px-4 text-sm"
                hasWipers
              >
                {isLoading ? 'Opening...' : 'View'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export type { PDFArtifactProps };
