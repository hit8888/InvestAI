import { useMemo, useRef, useState } from 'react';
import { X } from 'lucide-react';
import GeneratedEmailContent from '../pages/VisitorsPage/components/CompanyDetailsDrawer/GeneratedEmailContent';
import ErrorContent from '../pages/VisitorsPage/components/CompanyDetailsDrawer/ErrorContent';
import LeftSideContentContainer from '../pages/VisitorsPage/components/CompanyDetailsDrawer/LeftSideContentContainer';
import RelevantProfilesContent from '../pages/VisitorsPage/components/CompanyDetailsDrawer/RelevantProfilesContent';
import BrowsingHistoryContent from '../pages/VisitorsPage/components/CompanyDetailsDrawer/BrowsingHistoryContent';
import ConversationDetailsContent from '../pages/VisitorsPage/components/CompanyDetailsDrawer/ConversationDetailsContent';
import useSessionDetailsQuery from '../queries/query/useSessionDetailsQuery';
import useReachoutEmailQuery from '../queries/query/useReachoutEmailQuery';
import useIcpsQuery from '../queries/query/useIcpsQuery';
import useIcpDetailsQuery from '../queries/query/useIcpDetailsQuery';
import { normalizeSessionToConversationData, calculateSessionMetrics } from '../utils/common';
import ConversationDetailsDataResponseManager from '../managers/ConversationDetailsDataManager';
import type { Employee } from '../pages/VisitorsPage/components/CompanyDetailsDrawer/types';
import { mapSessionDetailToCompanyData } from '../pages/VisitorsPage/utils/mapVisitorToCompanyData';
import type { IcpsContact } from '@neuraltrade/core/types/admin/admin';
import { usePanelState, PANEL_MODE_LABELS, PANEL_MODE_MAX_WIDTH, type PanelMode } from '../hooks/usePanelState';
import DrawerSections from '../pages/ConversationsV2/components/DrawerSections';

export interface GenericDrawerFieldAccessors<T> {
  getProspectId: (row: T) => string;
}

export interface EntityDrawerContentProps<T> {
  data: T;
  isTableLoading?: boolean;
  onClose: () => void;
  fieldAccessors: GenericDrawerFieldAccessors<T>;
}

export function EntityDrawerContent<T>({ data, onClose, fieldAccessors }: EntityDrawerContentProps<T>) {
  const bodyHtmlRef = useRef<HTMLDivElement | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  // Use URL-based state management for panels
  const {
    currentMode: leftSideContentMode,
    setPanelMode: setLeftSideContentMode,
    clearPanelMode,
    hasActivePanel,
  } = usePanelState();

  const prospectId = fieldAccessors.getProspectId(data);

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
  const browsingHistory = companyData?.prospect?.browsing_history || [];

  const { data: icpList, isLoading: isIcpListLoading } = useIcpsQuery(
    { companyName: companyData?.name, domain: companyData?.website },
    { enabled: leftSideContentMode === 'relevant-profiles' && !!companyData?.name, retry: false },
  );

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
      icpList?.contacts?.map?.((icp: IcpsContact) => ({
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
    if (!hasActivePanel) return false;

    if (leftSideContentMode === 'generated-email') {
      return isReachoutEmailSuccess;
    } else if (leftSideContentMode === 'relevant-profiles') {
      return true; // Show panel immediately, loading state handled inside
    } else if (leftSideContentMode === 'browsing-history') {
      // Show if data is loaded OR still loading (to show loader)
      return !!sessionData || isSessionLoading;
    } else if (leftSideContentMode === 'conversation-log') {
      // Show if data is loaded OR still loading (to show loader)
      return !!sessionData || isSessionLoading;
    }
    return false;
  }, [hasActivePanel, isReachoutEmailSuccess, leftSideContentMode, sessionData, isSessionLoading]);

  const conversationDetailsManager = useMemo(() => {
    if (!sessionData) {
      return null;
    }

    return new ConversationDetailsDataResponseManager(normalizeSessionToConversationData(sessionData));
  }, [sessionData]);

  const formattedConversationData = useMemo(() => {
    return conversationDetailsManager?.getFormattedConversationData() ?? null;
  }, [conversationDetailsManager]);

  const formattedChatHistory = useMemo(() => {
    return conversationDetailsManager?.getFormattedChatHistory() ?? [];
  }, [conversationDetailsManager]);

  const sessionMetrics = useMemo(() => {
    return calculateSessionMetrics(formattedChatHistory, formattedConversationData);
  }, [formattedChatHistory, formattedConversationData]);

  const handleViewConversationDetails = () => {
    if (leftSideContentMode === 'conversation-log') {
      clearPanelMode();
    } else {
      setLeftSideContentMode('conversation-log' as PanelMode);
    }
  };
  const handleCloseDrawer = () => {
    setSelectedEmployee(null);
    clearPanelMode(); // Clear panel from URL
    onClose();
  };
  const handleCloseLeftSideContent = () => {
    clearPanelMode(); // Clear panel from URL
    setSelectedEmployee(null);
  };
  const handleFetchIcpList = () => {
    if (leftSideContentMode === 'relevant-profiles') {
      clearPanelMode();
    } else {
      setLeftSideContentMode('relevant-profiles' as PanelMode);
      // Query will automatically fetch when panel opens due to enabled condition
    }
  };
  const handleProspectGenerateEmail = (employee: Employee) => {
    setSelectedEmployee(employee);
    setLeftSideContentMode('generated-email' as PanelMode);
  };
  const handleIcpGenerateEmail = (employee: Employee) => {
    setSelectedEmployee(employee);
    setLeftSideContentMode('relevant-profiles' as PanelMode);
  };
  const handleIcpShowEmail = () => {
    setLeftSideContentMode('relevant-profiles' as PanelMode);
    fetchIcpDetails();
  };
  const handleViewBrowsingHistory = () => {
    if (leftSideContentMode === 'browsing-history') {
      clearPanelMode();
    } else {
      setLeftSideContentMode('browsing-history' as PanelMode);
    }
  };
  const handleIcpCancelEmail = () => {
    setLeftSideContentMode('relevant-profiles' as PanelMode);
    setSelectedEmployee(null);
  };

  // Show error state if session API fails
  if (isSessionError && !isLoading) {
    return <ErrorContent onClose={handleCloseDrawer} prospectId={prospectId} />;
  }

  return (
    <div className="relative w-full">
      <LeftSideContentContainer
        visible={showLeftSideContent}
        headerTitle={leftSideContentMode ? PANEL_MODE_LABELS[leftSideContentMode] : ''}
        onClose={handleCloseLeftSideContent}
        maxWidth={leftSideContentMode ? PANEL_MODE_MAX_WIDTH[leftSideContentMode] : undefined}
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
            isLoading={isIcpListLoading}
          />
        )}
        {leftSideContentMode === 'browsing-history' && (
          <BrowsingHistoryContent browsedUrls={browsingHistory} isLoading={isSessionLoading} />
        )}
        {leftSideContentMode === 'conversation-log' && (
          <ConversationDetailsContent
            chatHistory={formattedChatHistory}
            conversation={formattedConversationData}
            isLoading={isSessionLoading}
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
          <DrawerSections
            isLoading={isLoading}
            companyData={companyData}
            browsingHistory={browsingHistory}
            selectedEmployee={selectedEmployee}
            isReachoutEmailLoading={isReachoutEmailLoading}
            onGenerateEmail={handleProspectGenerateEmail}
            onViewBrowsingHistory={handleViewBrowsingHistory}
            onFetchIcpList={handleFetchIcpList}
            onViewConversationDetails={handleViewConversationDetails}
            leftSideContentMode={leftSideContentMode}
            sessionDurationInSeconds={sessionMetrics.sessionDurationInSeconds}
            totalMessageCount={sessionMetrics.totalMessageCount}
            deviceType={sessionData?.session?.device_type}
          />
        </div>
      </div>
    </div>
  );
}
