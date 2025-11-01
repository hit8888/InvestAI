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
  const { title = '', pdf_url } = data.content;
  const [isLoading, setIsLoading] = useState(false);

  // Use default values if not provided or use dummy values for demonstration
  const displayTitle = title || 'HR-as-Change-Agent.pdf';
  const fileSize = (data.metadata?.fileSize as string) || '1.2 MB';

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
            <div className="text-sm text-gray-500 mb-1">
              <span>{fileSize}</span>
            </div>
          </div>
        </div>

        {/* PDF Preview with case studies content */}
        <div className="mt-4 border border-gray-200 rounded bg-gray-50 p-4">
          <div className="flex flex-col gap-2">
            <div className="text-sm font-medium text-gray-800">Versa Networks – Customer Case Studies</div>
            <div className="text-sm text-gray-600">
              <ol className="list-decimal pl-5">
                <li className="mb-2">
                  <strong>Advanced Dermatology & Cosmetic Surgery (ADCS)</strong>
                  <br />
                  Uses Versa SASE to enable secure, high-performance connectivity for both on-premises and cloud
                  applications across multiple offices, supporting a distributed healthcare network.
                </li>
                <li className="mb-2">
                  <strong>SB Energy</strong>
                  <br />
                  Deploys Versa Unified SASE to secure their solar energy infrastructure, providing secure internet and
                  cloud access while improving productivity across sites and plants.
                </li>
                <li>
                  <strong>CommandLink</strong>
                </li>
              </ol>
            </div>
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-200">
              <div className="text-sm text-gray-700">{displayTitle}</div>
              <Button onClick={handleOpenPDF} disabled={isLoading} variant="default" className="px-4 text-sm" hasWipers>
                {isLoading ? 'Opening...' : 'View'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export type { PDFArtifactProps };
