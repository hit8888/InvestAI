import type { Employee, CompanyData } from './types';
import { BrowsedUrl } from '@meaku/core/types/common';
import CompanyDetailsSection from './CompanyDetailsSection';
import UserDetailsSection from './UserDetailsSection';
import AiChatSummaryCard from './AiChatSummaryCard';
import BrowsingHistoryCard from './BrowsingHistoryCard';
import FindRelevantProfilesCard from './FindRelevantProfilesCard';
import LoadingContent from './LoadingContent';

interface CompanyDetailsSectionsProps {
  isLoading?: boolean;
  companyData: CompanyData | null;
  browsingHistory: BrowsedUrl[];
  selectedEmployee: Employee | null;
  isReachoutEmailLoading: boolean;
  onGenerateEmail: (employee: Employee) => void;
  onViewBrowsingHistory: () => void;
  onFetchIcpList: () => void;
  onViewConversationDetails: () => void;
  leftSideContentMode: string | null;
  hideBrowsingHistory?: boolean;
  hideRelevantProfiles?: boolean;
  hideChatSummary?: boolean;
  sessionDurationInSeconds?: number;
  totalMessageCount?: number;
  deviceType?: string | null;
}

const CompanyDetailsSections = ({
  isLoading = false,
  companyData,
  selectedEmployee,
  isReachoutEmailLoading,
  onGenerateEmail,
  onViewBrowsingHistory,
  onFetchIcpList,
  onViewConversationDetails,
  leftSideContentMode,
  hideBrowsingHistory = false,
  hideRelevantProfiles = false,
  hideChatSummary = false,
  sessionDurationInSeconds,
  totalMessageCount,
  deviceType,
}: CompanyDetailsSectionsProps) => {
  if (isLoading) {
    return <LoadingContent />;
  }

  return (
    <>
      {/* Company Info Section */}
      <CompanyDetailsSection companyData={companyData} />

      {/* Employees Section */}
      <UserDetailsSection
        prospect={companyData?.prospect}
        onGenerateEmail={onGenerateEmail}
        isGeneratingEmail={
          isReachoutEmailLoading && selectedEmployee?.prospect_id === companyData?.prospect?.prospect_id
        }
        sessionDurationInSeconds={sessionDurationInSeconds}
        totalMessageCount={totalMessageCount}
        deviceType={deviceType}
      />

      {/* Panel Cards Section */}
      <div className="flex flex-col gap-3">
        {/* AI Chat Summary Card */}
        {!hideChatSummary && (
          <AiChatSummaryCard
            isActive={leftSideContentMode === 'conversation-log'}
            onClick={onViewConversationDetails}
            conversationSummary={companyData?.conversationSummary}
          />
        )}

        {/* Browsing History Card */}
        {!hideBrowsingHistory && (
          <BrowsingHistoryCard isActive={leftSideContentMode === 'browsing-history'} onClick={onViewBrowsingHistory} />
        )}

        {/* Find Relevant Profiles Card */}
        {!hideRelevantProfiles && (
          <FindRelevantProfilesCard isActive={leftSideContentMode === 'relevant-profiles'} onClick={onFetchIcpList} />
        )}
      </div>
    </>
  );
};

export default CompanyDetailsSections;
