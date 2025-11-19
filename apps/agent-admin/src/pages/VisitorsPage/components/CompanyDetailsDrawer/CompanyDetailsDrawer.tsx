import { useMemo, useRef, useState } from 'react';
import { X } from 'lucide-react';

import { Drawer, DrawerContent } from '@breakout/design-system/components/Drawer/index';
import type { Employee } from './types';
import useSessionDetailsQuery from '../../../../queries/query/useSessionDetailsQuery';
import useIcpsQuery from '../../../../queries/query/useIcpsQuery';
import useReachoutEmailQuery from '../../../../queries/query/useReachoutEmailQuery';
import GeneratedEmailContent from './GeneratedEmailContent';
import useIcpDetailsQuery from '../../../../queries/query/useIcpDetailsQuery';
import { mapSessionDetailToCompanyData } from '../../utils/mapVisitorToCompanyData';
import CompanyDetailsSections from './CompanyDetailsSections';
import LeftSideContentContainer from './LeftSideContentContainer';
import RelevantProfilesContent from './RelevantProfilesContent';
import BrowsingHistoryContent from './BrowsingHistoryContent';
import ConversationDetailsContent from './ConversationDetailsContent';
import { normalizeSessionToConversationData, calculateSessionMetrics } from '../../../../utils/common';
import ConversationDetailsDataResponseManager from '../../../../managers/ConversationDetailsDataManager';
import { PANEL_MODE_MAX_WIDTH } from '../../../../hooks/usePanelState';

type CompanyDetailsDrawerProps = {
  open: boolean;
  onClose: () => void;
  prospectId: string;
  hideBrowsingHistory?: boolean;
  hideRelevantProfiles?: boolean;
  hideChatSummary?: boolean;
};

type LeftSideContentMode = 'generated-email' | 'conversation-log' | 'relevant-profiles' | 'browsing-history' | null;

const LeftSideContentModeLabels = {
  'generated-email': 'Generated Email',
  'conversation-log': 'Conversation Log',
  'relevant-profiles': 'Relevant Profiles',
  'browsing-history': 'Browsing History',
};

const CompanyDetailsDrawer = ({
  open,
  onClose,
  prospectId,
  hideBrowsingHistory = false,
  hideRelevantProfiles = false,
  hideChatSummary = false,
}: CompanyDetailsDrawerProps) => {
  const bodyHtmlRef = useRef<HTMLDivElement | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [leftSideContentMode, setLeftSideContentMode] = useState<LeftSideContentMode>(null);

  const { data: sessionData, isLoading } = useSessionDetailsQuery({ prospectId }, { enabled: !!prospectId });

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
      return true; // Show panel immediately, loading state handled inside
    } else if (leftSideContentMode === 'browsing-history') {
      return true;
    } else if (leftSideContentMode === 'conversation-log') {
      return true;
    }
    return false;
  }, [isReachoutEmailSuccess, leftSideContentMode]);

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
    setLeftSideContentMode('conversation-log');
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
    // Query will automatically fetch when panel opens due to enabled condition
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
    <Drawer open={open} onOpenChange={handleCloseDrawer} direction="right">
      {open && (
        <DrawerContent
          className="z-[1001] ml-auto flex h-screen w-1/2 flex-row justify-end gap-4 rounded-none border-none"
          data-vaul-no-drag
        >
          <div className="relative w-full">
            <LeftSideContentContainer
              visible={showLeftSideContent}
              headerTitle={leftSideContentMode ? LeftSideContentModeLabels[leftSideContentMode] : ''}
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
                <BrowsingHistoryContent browsedUrls={browsingHistory} isLoading={isLoading} />
              )}

              {leftSideContentMode === 'conversation-log' && (
                <ConversationDetailsContent
                  chatHistory={formattedChatHistory}
                  conversation={formattedConversationData}
                  isLoading={isLoading}
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
                <CompanyDetailsSections
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
                  hideBrowsingHistory={hideBrowsingHistory}
                  hideRelevantProfiles={hideRelevantProfiles}
                  hideChatSummary={hideChatSummary}
                  sessionDurationInSeconds={sessionMetrics.sessionDurationInSeconds}
                  totalMessageCount={sessionMetrics.totalMessageCount}
                  deviceType={sessionData?.session?.device_type}
                />
              </div>
            </div>
          </div>
        </DrawerContent>
      )}
    </Drawer>
  );
};

export default CompanyDetailsDrawer;
