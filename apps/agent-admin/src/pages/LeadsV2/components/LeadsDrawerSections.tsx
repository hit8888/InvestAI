import { motion, AnimatePresence } from 'framer-motion';
import type { Employee, CompanyData } from '../../VisitorsPage/components/CompanyDetailsDrawer/types';
import CompanyDetailsSection from '../../VisitorsPage/components/CompanyDetailsDrawer/CompanyDetailsSection';
import UserDetailsSection from '../../VisitorsPage/components/CompanyDetailsDrawer/UserDetailsSection';
import DrawerContentLoading from '../../VisitorsPage/components/CompanyDetailsDrawer/DrawerContentLoading';

interface LeadsDrawerSectionsProps {
  isLoading?: boolean;
  companyData: CompanyData | null;
  selectedEmployee: Employee | null;
  isReachoutEmailLoading: boolean;
  onGenerateEmail: (employee: Employee) => void;
}

const LeadsDrawerSections = ({
  isLoading = false,
  companyData,
  selectedEmployee,
  isReachoutEmailLoading,
  onGenerateEmail,
}: LeadsDrawerSectionsProps) => {
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

          {/* User Details Section - Simplified for leads (no browsing history) */}
          <UserDetailsSection
            prospect={companyData?.prospect}
            onGenerateEmail={onGenerateEmail}
            isGeneratingEmail={
              isReachoutEmailLoading && selectedEmployee?.prospect_id === companyData?.prospect?.prospect_id
            }
            sessionDurationInSeconds={0}
            totalMessageCount={0}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LeadsDrawerSections;
