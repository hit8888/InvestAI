import { useMemo, useRef, useState } from 'react';
import { X } from 'lucide-react';
import type { DrawerContentProps } from '../../../features/table-system';
import LoadingContent from '../../VisitorsPage/components/CompanyDetailsDrawer/LoadingContent';
import type { Employee } from '../../VisitorsPage/components/CompanyDetailsDrawer/types';
import useSessionDetailsQuery from '../../../queries/query/useSessionDetailsQuery';
import UserDetailsSection from '../../VisitorsPage/components/CompanyDetailsDrawer/UserDetailsSection';
import CompanyDetailsSection from '../../VisitorsPage/components/CompanyDetailsDrawer/CompanyDetailsSection';
import useReachoutEmailQuery from '../../../queries/query/useReachoutEmailQuery';
import { mapSessionDetailToCompanyData } from '../../VisitorsPage/utils/mapVisitorToCompanyData';
import LeftSideContentContainer from '../../VisitorsPage/components/CompanyDetailsDrawer/LeftSideContentContainer';
import GeneratedEmailContent from '../../VisitorsPage/components/CompanyDetailsDrawer/GeneratedEmailContent';

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

type LeftSideContentMode = 'generated-email' | null;

const LeftSideContentModeLabels = {
  'generated-email': 'Generated Email',
};

/**
 * Drawer content for lead details
 * Simplified version that only shows company/user details and email generation
 * Hides: browsing history, relevant profiles, and AI chat summary
 */
export const LeadsDrawerContent = ({ data, onClose }: DrawerContentProps<LeadRow>) => {
  const bodyHtmlRef = useRef<HTMLDivElement | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [leftSideContentMode, setLeftSideContentMode] = useState<LeftSideContentMode>(null);

  const { data: sessionData, isLoading } = useSessionDetailsQuery(
    { prospectId: data.prospect_id },
    { enabled: !!data.prospect_id },
  );

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
    setLeftSideContentMode(null);
    onClose();
  };

  const handleCloseSideContent = () => {
    setLeftSideContentMode(null);
    setSelectedEmployee(null);
  };

  return (
    <div className="relative w-full">
      {/* Left side content (email generation) */}
      <LeftSideContentContainer
        visible={!!leftSideContentMode}
        onClose={handleCloseSideContent}
        headerTitle={leftSideContentMode ? LeftSideContentModeLabels[leftSideContentMode] : ''}
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
          {isLoading ? (
            <LoadingContent />
          ) : (
            <>
              {/* Company Info Section */}
              <CompanyDetailsSection companyData={companyData} />

              {/* User Details Section */}
              <UserDetailsSection
                prospect={companyData?.prospect}
                onGenerateEmail={handleProspectGenerateEmail}
                onViewBrowsingHistory={() => {}}
                showViewBrowsingHistory={false}
                isGeneratingEmail={
                  isReachoutEmailLoading && selectedEmployee?.prospect_id === companyData?.prospect?.prospect_id
                }
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};
