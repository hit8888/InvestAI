import { motion, AnimatePresence } from 'framer-motion';
import type { Employee, CompanyData } from '../../VisitorsPage/components/CompanyDetailsDrawer/types';
import { BrowsedUrl } from '@meaku/core/types/common';
import CompanyDetailsSection from '../../VisitorsPage/components/CompanyDetailsDrawer/CompanyDetailsSection';
import UserDetailsSection from '../../VisitorsPage/components/CompanyDetailsDrawer/UserDetailsSection';
import RelevantProfilesSection from '../../VisitorsPage/components/CompanyDetailsDrawer/RelevantProfilesSection';
import UserInteractionSection from '../../VisitorsPage/components/CompanyDetailsDrawer/UserInteractionSection';
import DrawerContentLoading from '../../VisitorsPage/components/CompanyDetailsDrawer/DrawerContentLoading';

interface DrawerSectionsProps {
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
}

const DrawerSections = ({
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
}: DrawerSectionsProps) => {
  return (
    <AnimatePresence mode="wait">
      {isLoading ? (
        <motion.div
          key="drawer-loading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.05, ease: 'linear' }}
        >
          <DrawerContentLoading />
        </motion.div>
      ) : (
        <motion.div
          key="drawer-content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.08, ease: 'linear' }}
          className="flex flex-col gap-10"
        >
          {/* Company Info Section */}
          <CompanyDetailsSection companyData={companyData} />

          {/* Employees Section */}
          <UserDetailsSection
            prospect={companyData?.prospect}
            onGenerateEmail={onGenerateEmail}
            onViewBrowsingHistory={onViewBrowsingHistory}
            showViewBrowsingHistory={browsingHistory.length > 0}
            isGeneratingEmail={
              isReachoutEmailLoading && selectedEmployee?.prospect_id === companyData?.prospect?.prospect_id
            }
          />

          {/* Relevant Profiles Section */}
          <RelevantProfilesSection
            companyName={companyData?.name}
            onSearchProfiles={onFetchIcpList}
            disableSearchProfiles={isIcpListLoading || leftSideContentMode === 'relevant-profiles' || isIcpListError}
            showError={isIcpListError}
            isLoadingProfiles={isIcpListLoading}
          />

          {/* Browsing & Conversation Summary */}
          {companyData?.prospect?.session_id && (
            <UserInteractionSection
              conversationSummary={companyData?.conversationSummary}
              onViewConversationDetails={onViewConversationDetails}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DrawerSections;
