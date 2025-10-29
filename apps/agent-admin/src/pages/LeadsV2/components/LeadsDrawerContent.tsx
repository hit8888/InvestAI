import { useMemo, useRef, useState } from 'react';
import { X } from 'lucide-react';
import type { DrawerContentProps } from '../../../features/table-system';
import { usePanelState, PANEL_MODE_LABELS } from '../../../hooks/usePanelState';
import type { Employee } from '../../VisitorsPage/components/CompanyDetailsDrawer/types';
import useSessionDetailsQuery from '../../../queries/query/useSessionDetailsQuery';
import useReachoutEmailQuery from '../../../queries/query/useReachoutEmailQuery';
import { mapSessionDetailToCompanyData } from '../../VisitorsPage/utils/mapVisitorToCompanyData';
import LeadsDrawerSections from './LeadsDrawerSections';
import LeftSideContentContainer from '../../VisitorsPage/components/CompanyDetailsDrawer/LeftSideContentContainer';
import GeneratedEmailContent from '../../VisitorsPage/components/CompanyDetailsDrawer/GeneratedEmailContent';
import ErrorContent from '../../VisitorsPage/components/CompanyDetailsDrawer/ErrorContent';

interface LeadRow {
  id: number;
  lead_id: string;
  prospect_id: string;
  session_id: string | null;
  company: string | null;
  name: string | null;
  email: string | null;
  country: string | null;
  product_interest: string | null;
  intent_score: string | null;
  sdr_assignment: string | null;
  meeting_booked: boolean | null;
  created_on: string;
  updated_on: string;
  [key: string]: unknown;
}

/**
 * Drawer content for lead details
 * Simplified version that only shows company/user details and email generation
 * Hides: browsing history, relevant profiles, and AI chat summary
 */
export const LeadsDrawerContent = ({ data, onClose }: DrawerContentProps<LeadRow>) => {
  const bodyHtmlRef = useRef<HTMLDivElement | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  // Use URL-based state management for panels
  const {
    currentMode: leftSideContentMode,
    setPanelMode: setLeftSideContentMode,
    clearPanelMode,
    hasActivePanel,
  } = usePanelState();

  // Get prospect_id from data. The table system should populate the correct field based on:
  // Priority: backend entity metadata (is_row_key) > config.rowKeyField ('prospect_id') > 'id'
  // Fallback to id for safety in case of misconfiguration
  const prospectId = data.prospect_id || String(data.id);

  const {
    data: sessionData,
    isLoading: isSessionLoading,
    isError: isSessionError,
  } = useSessionDetailsQuery({ prospectId }, { enabled: !!prospectId, retry: false });

  // Show loading only for session data (drawer's own loading state)
  const isLoading = isSessionLoading;

  const companyData = useMemo(() => {
    return sessionData ? mapSessionDetailToCompanyData(sessionData) : null;
  }, [sessionData]);

  const { data: reachoutEmailData, isLoading: isReachoutEmailLoading } = useReachoutEmailQuery(
    {
      email_type: 'website_user',
      session_id: companyData?.prospect?.session_id || undefined,
      prospect_id: companyData?.prospect?.prospect_id || undefined,
    },
    {
      enabled: !!selectedEmployee,
      retry: false,
    },
  );

  const handleProspectGenerateEmail = () => {
    setSelectedEmployee(companyData?.prospect || null);
    setLeftSideContentMode('generated-email');
  };

  const handleCloseDrawer = () => {
    setSelectedEmployee(null);
    clearPanelMode(); // Clear panel from URL
    onClose();
  };

  const handleCloseSideContent = () => {
    clearPanelMode(); // Clear panel from URL
    setSelectedEmployee(null);
  };

  // Show error state if session API fails
  if (isSessionError && !isLoading) {
    return <ErrorContent onClose={handleCloseDrawer} prospectId={prospectId} />;
  }

  return (
    <div className="relative w-full">
      {/* Left side content (email generation) */}
      <LeftSideContentContainer
        visible={hasActivePanel}
        onClose={handleCloseSideContent}
        headerTitle={leftSideContentMode ? PANEL_MODE_LABELS[leftSideContentMode] : ''}
      >
        {leftSideContentMode === 'generated-email' && (
          <GeneratedEmailContent
            selectedEmployee={selectedEmployee}
            isLoadingIcpDetails={false}
            emailData={reachoutEmailData}
            emailDataLoading={isReachoutEmailLoading}
            bodyHtmlRef={bodyHtmlRef}
            fetchIcpDetails={() => {}}
          />
        )}
      </LeftSideContentContainer>

      {/* Main drawer content */}
      <div className="flex h-full w-full select-text flex-col rounded-bl-2xl rounded-tl-2xl bg-white">
        {/* Header with close button */}
        <div className="flex justify-end px-3 pt-3">
          <button
            onClick={handleCloseDrawer}
            className="flex h-6 w-6 items-center justify-center rounded hover:bg-gray-100"
            aria-label="Close drawer"
          >
            <X className="h-4 w-4 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col gap-10 overflow-auto px-5 pb-5">
          <LeadsDrawerSections
            isLoading={isLoading}
            companyData={companyData}
            selectedEmployee={selectedEmployee}
            isReachoutEmailLoading={isReachoutEmailLoading}
            onGenerateEmail={handleProspectGenerateEmail}
          />
        </div>
      </div>
    </div>
  );
};
