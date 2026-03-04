import { motion, AnimatePresence } from 'framer-motion';
import type { Employee, CompanyData } from '../../VisitorsPage/components/CompanyDetailsDrawer/types';
import { BrowsedUrl } from '@neuraltrade/core/types/common';
import CompanyDetailsSection from '../../VisitorsPage/components/CompanyDetailsDrawer/CompanyDetailsSection';
import UserDetailsSection from '../../VisitorsPage/components/CompanyDetailsDrawer/UserDetailsSection';
import AiChatSummaryCard from '../../VisitorsPage/components/CompanyDetailsDrawer/AiChatSummaryCard';
import BrowsingHistoryCard from '../../VisitorsPage/components/CompanyDetailsDrawer/BrowsingHistoryCard';
import FindRelevantProfilesCard from '../../VisitorsPage/components/CompanyDetailsDrawer/FindRelevantProfilesCard';
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
  leftSideContentMode: string | null;
  sessionDurationInSeconds?: number;
  totalMessageCount?: number;
  deviceType?: string | null;
}

const DrawerSections = ({
  isLoading = false,
  companyData,
  selectedEmployee,
  isReachoutEmailLoading,
  onGenerateEmail,
  onViewBrowsingHistory,
  onFetchIcpList,
  onViewConversationDetails,
  leftSideContentMode,
  sessionDurationInSeconds,
  totalMessageCount,
  deviceType,
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
            isGeneratingEmail={
              isReachoutEmailLoading && selectedEmployee?.prospect_id === companyData?.prospect?.prospect_id
            }
            sessionDurationInSeconds={sessionDurationInSeconds}
            totalMessageCount={totalMessageCount}
            deviceType={deviceType}
          />

          {/* Panel Cards Section */}
          <div className="flex flex-col gap-10">
            {/* AI Chat Summary Card */}
            <AiChatSummaryCard
              isActive={leftSideContentMode === 'conversation-log'}
              onClick={onViewConversationDetails}
              conversationSummary={companyData?.conversationSummary}
            />

            {/* Browsing History Card */}
            <BrowsingHistoryCard
              isActive={leftSideContentMode === 'browsing-history'}
              onClick={onViewBrowsingHistory}
            />

            {/* Find Relevant Profiles Card */}
            <FindRelevantProfilesCard isActive={leftSideContentMode === 'relevant-profiles'} onClick={onFetchIcpList} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DrawerSections;
