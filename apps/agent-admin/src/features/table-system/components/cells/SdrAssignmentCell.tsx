import { UserRoundXIcon } from 'lucide-react';
import { useState } from 'react';
import { ROUTING_TYPE_LOGO_MAP } from '../../../../utils/constants';

interface SdrAssignmentCellProps {
  /** SDR assignment data object */
  value: unknown;
  /** Optional tooltip text */
  tooltip?: string;
}

interface SdrAssignment {
  assigned_user?: {
    full_name?: string;
    profile_picture?: string;
  };
  routing_source?: string;
}

// Helper to get initials from full name
const getInitials = (fullName: string): string => {
  const names = fullName.trim().split(' ').filter(Boolean);
  if (names.length === 0) return '?';
  if (names.length === 1) return names[0].charAt(0).toUpperCase();
  return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
};

/**
 * SdrAssignmentCell - Pure component for displaying SDR assignment
 *
 * This component is now metadata-driven and receives pre-processed props:
 * - value: SDR assignment data object
 * - tooltip: Tooltip text from TOOLTIP metadata relations (optional)
 *
 * Shows avatar, rep name, and company logo or "Unassigned" with icon
 */
export const SdrAssignmentCell = ({ value, tooltip }: SdrAssignmentCellProps) => {
  const [profilePictureError, setProfilePictureError] = useState(false);
  const [companyLogoError, setCompanyLogoError] = useState(false);

  const sdrAssignment = value as SdrAssignment | null | undefined;

  if (!sdrAssignment || !sdrAssignment.assigned_user) {
    return (
      <div className="flex items-center gap-2 text-gray-400" title={tooltip}>
        <UserRoundXIcon className="h-4 w-4" />
        <span className="text-xs">Unassigned</span>
      </div>
    );
  }

  const { assigned_user, routing_source } = sdrAssignment;
  const { full_name, profile_picture } = assigned_user;
  const companyLogo = routing_source ? ROUTING_TYPE_LOGO_MAP[routing_source] : null;

  return (
    <div className="flex w-full items-center gap-2" title={tooltip}>
      {/* Profile picture with fallback avatar - always show avatar */}
      {!profile_picture || profilePictureError ? (
        <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-gray-800">
          <span className="text-[9px] font-semibold text-gray-50">{getInitials(full_name || '')}</span>
        </div>
      ) : (
        <img
          src={profile_picture}
          alt={full_name || 'rep'}
          className="h-5 w-5 flex-shrink-0 rounded-full object-cover"
          onError={() => setProfilePictureError(true)}
        />
      )}

      <div className="flex min-w-0 flex-1 items-center gap-2">
        {/* Rep name */}
        <p title={full_name || ''} className="max-w-32 truncate text-sm text-gray-900">
          {full_name || 'Unknown'}
        </p>

        {/* Company/routing logo - hide silently if fails to load */}
        {companyLogo && !companyLogoError && (
          <img
            src={companyLogo}
            alt="company"
            className="h-4 w-4 flex-shrink-0 rounded-full"
            onError={() => setCompanyLogoError(true)}
          />
        )}
      </div>
    </div>
  );
};
