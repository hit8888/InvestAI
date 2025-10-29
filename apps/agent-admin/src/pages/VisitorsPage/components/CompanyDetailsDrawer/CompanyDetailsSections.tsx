import type { Employee, CompanyData } from './types';
import { BrowsedUrl } from '@meaku/core/types/common';
import CompanyDetailsSection from './CompanyDetailsSection';
import UserDetailsSection from './UserDetailsSection';
import RelevantProfilesSection from './RelevantProfilesSection';
import UserInteractionSection from './UserInteractionSection';
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
  isIcpListLoading: boolean;
  leftSideContentMode: string | null;
  isIcpListError: boolean;
  hideBrowsingHistory?: boolean;
  hideRelevantProfiles?: boolean;
  hideChatSummary?: boolean;
}

const CompanyDetailsSections = ({
  isLoading = false,
  companyData,
  browsingHistory,
  selectedEmployee,
  isReachoutEmailLoading,
  onGenerateEmail,
  onViewBrowsingHistory,
  onFetchIcpList,
  onViewConversationDetails,
  isIcpListLoading,
  leftSideContentMode,
  isIcpListError,
  hideBrowsingHistory = false,
  hideRelevantProfiles = false,
  hideChatSummary = false,
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
        onViewBrowsingHistory={onViewBrowsingHistory}
        showViewBrowsingHistory={!hideBrowsingHistory && browsingHistory.length > 0}
        isGeneratingEmail={
          isReachoutEmailLoading && selectedEmployee?.prospect_id === companyData?.prospect?.prospect_id
        }
      />

      {/* Relevant Profiles Section */}
      {!hideRelevantProfiles && (
        <RelevantProfilesSection
          companyName={companyData?.name}
          onSearchProfiles={onFetchIcpList}
          disableSearchProfiles={isIcpListLoading || leftSideContentMode === 'relevant-profiles' || isIcpListError}
          showError={isIcpListError}
          isLoadingProfiles={isIcpListLoading}
        />
      )}

      {/* Browsing & Conversation Summary */}
      {!hideChatSummary && companyData?.prospect?.session_id && (
        <UserInteractionSection
          conversationSummary={companyData?.conversationSummary}
          onViewConversationDetails={onViewConversationDetails}
        />
      )}
    </>
  );
};

export default CompanyDetailsSections;
