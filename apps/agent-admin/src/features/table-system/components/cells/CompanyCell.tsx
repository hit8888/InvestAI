import { Building2 } from 'lucide-react';
import { useState } from 'react';
import { CellContainer } from './CellContainer';
import { TruncatedText } from './TruncatedText';
import EmptyCell from './EmptyCell';

interface CompanyCellProps {
  /** Company name to display */
  name: string | null | undefined;
  /** Pre-computed logo URL from metadata */
  logoUrl?: string;
  /** Email to show as subtitle (optional) */
  email?: string;
  /** Tooltip text (optional) */
  tooltip?: string;
}

/**
 * CompanyCell - Pure component for displaying company information
 *
 * This component is now metadata-driven and receives pre-processed props:
 * - name: Company name from primary field
 * - logoUrl: Pre-computed logo URL from LOGO metadata relations
 * - email: Email from EMAIL metadata relations (optional)
 * - tooltip: Tooltip text from TOOLTIP metadata relations (optional)
 *
 * No business logic - just renders the provided data!
 */
export const CompanyCell = ({ name, logoUrl, email, tooltip }: CompanyCellProps) => {
  const [logoError, setLogoError] = useState(false);

  if (!name) {
    return <EmptyCell />;
  }

  // Show email if provided (no more page-specific logic)
  const shouldShowEmail = !!email;

  return (
    <CellContainer className="gap-3">
      {/* Logo or Icon */}
      <div className="flex-shrink-0">
        {logoUrl && !logoError ? (
          <img
            src={logoUrl}
            alt={name}
            className="h-6 w-6 rounded object-contain"
            onError={() => setLogoError(true)}
            title={tooltip}
          />
        ) : (
          <div className="flex h-6 w-6 items-center justify-center rounded bg-gray-100" title={tooltip}>
            <Building2 className="h-4 w-4 text-gray-500" />
          </div>
        )}
      </div>

      {/* Company Info */}
      <div className="min-w-0 flex-1">
        {/* Company Name - Limited to 200px with conditional tooltip */}
        <TruncatedText text={name} maxWidth="200px" tooltipSide="top" tooltipDelay={200} />

        {/* Company Email (optional) */}
        {shouldShowEmail && (
          <div className="truncate text-xs text-gray-500" title={email}>
            {email}
          </div>
        )}
      </div>
    </CellContainer>
  );
};
