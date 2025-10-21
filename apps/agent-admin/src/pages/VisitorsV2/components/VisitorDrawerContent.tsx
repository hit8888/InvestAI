import { useMemo, useRef, useState } from 'react';
import { X } from 'lucide-react';
import type { DrawerContentProps } from '../../../features/table-system';
import useSessionDetailsQuery from '../../../queries/query/useSessionDetailsQuery';
import useIcpsQuery from '../../../queries/query/useIcpsQuery';
import useReachoutEmailQuery from '../../../queries/query/useReachoutEmailQuery';
import useIcpDetailsQuery from '../../../queries/query/useIcpDetailsQuery';
import { mapSessionDetailToCompanyData } from '../../VisitorsPage/utils/mapVisitorToCompanyData';
import { normalizeSessionToConversationData } from '../../../utils/common';
import ConversationDetailsDataResponseManager from '../../../managers/ConversationDetailsDataManager';
import LoadingContent from '../../VisitorsPage/components/CompanyDetailsDrawer/LoadingContent';
import CompanyDetailsSection from '../../VisitorsPage/components/CompanyDetailsDrawer/CompanyDetailsSection';
import UserDetailsSection from '../../VisitorsPage/components/CompanyDetailsDrawer/UserDetailsSection';
import RelevantProfilesSection from '../../VisitorsPage/components/CompanyDetailsDrawer/RelevantProfilesSection';
import UserInteractionSection from '../../VisitorsPage/components/CompanyDetailsDrawer/UserInteractionSection';
import LeftSideContentContainer from '../../VisitorsPage/components/CompanyDetailsDrawer/LeftSideContentContainer';
import GeneratedEmailContent from '../../VisitorsPage/components/CompanyDetailsDrawer/GeneratedEmailContent';
import RelevantProfilesContent from '../../VisitorsPage/components/CompanyDetailsDrawer/RelevantProfilesContent';
import BrowsingHistoryContent from '../../VisitorsPage/components/CompanyDetailsDrawer/BrowsingHistoryContent';
import ConversationDetailsContent from '../../VisitorsPage/components/CompanyDetailsDrawer/ConversationDetailsContent';
import type { Employee } from '../../VisitorsPage/components/CompanyDetailsDrawer/types';

interface VisitorRow {
  id: number;
  prospect_id: string;
  session_id: string | null;
  name: string | null;
  email: string | null;
  company: string | null;
  country: string | null;
  updated_on: string;
  product_interest: string | null;
  sdr_assignment: string | null;
  [key: string]: unknown;
}

type LeftSideContentMode = 'generated-email' | 'conversation-details' | 'relevant-profiles' | 'browsing-history' | null;

const LeftSideContentModeLabels = {
  'generated-email': 'Generated Email',
  'conversation-details': 'Conversation Details',
  'relevant-profiles': 'Relevant Profiles',
  'browsing-history': 'Browsing History',
};

/**
 * Drawer content for visitor details
 * V2 version without nested Drawer wrapper (to avoid conflicts with GenericRowDrawer)
 */
export const VisitorDrawerContent = ({ data, onClose, isTableLoading }: DrawerContentProps<VisitorRow>) => {
  const bodyHtmlRef = useRef<HTMLDivElement | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [leftSideContentMode, setLeftSideContentMode] = useState<LeftSideContentMode>(null);

  const { data: sessionData, isLoading: isSessionLoading } = useSessionDetailsQuery(
    { prospectId: data.prospect_id },
    { enabled: !!data.prospect_id },
  );

  // Show loading if either table is loading or session data is loading
  const isLoading = isTableLoading || isSessionLoading;

  const companyData = useMemo(() => {
    return sessionData ? mapSessionDetailToCompanyData(sessionData) : null;
  }, [sessionData]);
  const browsingHistory = companyData?.prospect?.browsing_history || [];

  const {
    data: icpList,
    isLoading: isIcpListLoading,
    refetch: fetchIcpList,
    isError: isIcpListError,
    isSuccess: isIcpListSuccess,
  } = useIcpsQuery({ companyName: companyData?.name, domain: companyData?.website }, { enabled: false, retry: false });
  const {
    data: icpDetails,
    isLoading: isIcpDetailsLoading,
    refetch: fetchIcpDetails,
  } = useIcpDetailsQuery({ icpId: selectedEmployee?.icp_id }, { enabled: false, retry: false });
  const {
    data: reachoutEmailData,
    isLoading: isReachoutEmailLoading,
    isSuccess: isReachoutEmailSuccess,
  } = useReachoutEmailQuery(
    {
      email_type: selectedEmployee?.icp_id ? 'prospective_icp' : 'website_user',
      session_id: companyData?.prospect?.session_id || undefined,
      prospect_id: companyData?.prospect?.prospect_id || undefined,
      icp_id: selectedEmployee?.icp_id ?? undefined,
    },
    {
      enabled: !!selectedEmployee,
      retry: false,
    },
  );

  const icps: Employee[] = useMemo(
    () =>
      icpList?.contacts?.map?.((icp) => ({
        icp_id: icp.id,
        name: icp.name,
        title: icp.title,
        avatar: icp.profile_picture_url,
        linkedin: icp.linkedin_url,
        email: icp.id === icpDetails?.contact?.id ? icpDetails?.contact?.email : '',
      })) || [],
    [icpList, icpDetails],
  );

  const showLeftSideContent = useMemo(() => {
    if (leftSideContentMode === 'generated-email') {
      return isReachoutEmailSuccess;
    } else if (leftSideContentMode === 'relevant-profiles') {
      return isIcpListSuccess;
    } else if (leftSideContentMode === 'browsing-history') {
      return true;
    } else if (leftSideContentMode === 'conversation-details') {
      return true;
    }
    return false;
  }, [isIcpListSuccess, isReachoutEmailSuccess, leftSideContentMode]);

  const formattedConversationData = useMemo(() => {
    if (!sessionData) {
      return null;
    }

    return new ConversationDetailsDataResponseManager(
      normalizeSessionToConversationData(sessionData),
    ).getFormattedConversationData();
  }, [sessionData]);

  const handleViewConversationDetails = () => {
    setLeftSideContentMode('conversation-details');
  };

  const handleCloseDrawer = () => {
    setSelectedEmployee(null);
    setLeftSideContentMode(null);
    onClose();
  };

  const handleCloseLeftSideContent = () => {
    setLeftSideContentMode(null);
    setSelectedEmployee(null);
  };

  const handleFetchIcpList = () => {
    setLeftSideContentMode('relevant-profiles');
    fetchIcpList();
  };

  const handleProspectGenerateEmail = (employee: Employee) => {
    setSelectedEmployee(employee);
    setLeftSideContentMode('generated-email');
  };

  const handleIcpGenerateEmail = (employee: Employee) => {
    setSelectedEmployee(employee);
    setLeftSideContentMode('relevant-profiles');
  };

  const handleIcpShowEmail = () => {
    setLeftSideContentMode('relevant-profiles');
    fetchIcpDetails();
  };

  const handleViewBrowsingHistory = () => {
    setLeftSideContentMode('browsing-history');
  };

  const handleIcpCancelEmail = () => {
    setLeftSideContentMode('relevant-profiles');
    setSelectedEmployee(null);
  };

  return (
    <div className="relative w-full">
      <LeftSideContentContainer
        visible={showLeftSideContent}
        headerTitle={leftSideContentMode ? LeftSideContentModeLabels[leftSideContentMode] : ''}
        onClose={handleCloseLeftSideContent}
      >
        {leftSideContentMode === 'generated-email' && (
          <GeneratedEmailContent
            selectedEmployee={selectedEmployee}
            isLoadingIcpDetails={isIcpDetailsLoading}
            emailData={reachoutEmailData}
            emailDataLoading={isReachoutEmailLoading}
            bodyHtmlRef={bodyHtmlRef}
            fetchIcpDetails={fetchIcpDetails}
          />
        )}

        {leftSideContentMode === 'relevant-profiles' && (
          <RelevantProfilesContent
            icps={icps}
            onGenerateEmail={handleIcpGenerateEmail}
            selectedEmployee={selectedEmployee}
            emailData={reachoutEmailData}
            bodyHtmlRef={bodyHtmlRef}
            generatingEmail={isReachoutEmailLoading}
            onShowEmail={handleIcpShowEmail}
            loadingEmail={isIcpDetailsLoading}
            onCancelEmail={handleIcpCancelEmail}
          />
        )}

        {leftSideContentMode === 'browsing-history' && <BrowsingHistoryContent browsedUrls={browsingHistory} />}

        {leftSideContentMode === 'conversation-details' && (
          <ConversationDetailsContent
            chatHistory={sessionData?.chat_history ?? []}
            conversation={formattedConversationData}
          />
        )}
      </LeftSideContentContainer>
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

              {/* Employees Section */}
              <UserDetailsSection
                prospect={companyData?.prospect}
                onGenerateEmail={handleProspectGenerateEmail}
                onViewBrowsingHistory={handleViewBrowsingHistory}
                showViewBrowsingHistory={browsingHistory.length > 0}
                isGeneratingEmail={
                  isReachoutEmailLoading && selectedEmployee?.prospect_id === companyData?.prospect?.prospect_id
                }
              />

              {/* Relevant Profiles Section */}
              <RelevantProfilesSection
                companyName={companyData?.name}
                onSearchProfiles={handleFetchIcpList}
                disableSearchProfiles={
                  isIcpListLoading || leftSideContentMode === 'relevant-profiles' || isIcpListError
                }
                showError={isIcpListError}
                isLoadingProfiles={isIcpListLoading}
              />

              {/* Browsing & Conversation Summary */}
              {companyData?.prospect?.session_id && (
                <UserInteractionSection
                  conversationSummary={companyData?.conversationSummary}
                  onViewConversationDetails={handleViewConversationDetails}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
