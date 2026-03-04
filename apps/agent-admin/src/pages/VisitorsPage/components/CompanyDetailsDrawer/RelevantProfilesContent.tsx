import { ReachoutEmailResponse } from '@neuraltrade/core/types/admin/api';
import { AnimatePresence, motion } from 'framer-motion';

import RelevantProfileItem from './RelevantProfileItem';
import RelevantProfilesLoading from './RelevantProfilesLoading';
import { Employee } from './types';

type RelevantProfilesContentProps = {
  icps: Employee[];
  onGenerateEmail: (employee: Employee) => void;
  selectedEmployee: Employee | null;
  emailData?: ReachoutEmailResponse;
  bodyHtmlRef: React.RefObject<HTMLDivElement | null>;
  generatingEmail: boolean;
  onShowEmail: (employee: Employee) => void;
  loadingEmail: boolean;
  onCancelEmail: () => void;
  isLoading?: boolean;
};

const RelevantProfilesContent = ({
  icps,
  onGenerateEmail,
  selectedEmployee,
  emailData,
  bodyHtmlRef,
  generatingEmail,
  onShowEmail,
  loadingEmail,
  onCancelEmail,
  isLoading = false,
}: RelevantProfilesContentProps) => {
  return (
    <AnimatePresence mode="wait">
      {isLoading ? (
        <motion.div
          key="relevant-profiles-loading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.05, ease: 'linear' }}
        >
          <RelevantProfilesLoading />
        </motion.div>
      ) : (
        <motion.div
          key="relevant-profiles-content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.05, ease: 'linear' }}
          className="flex flex-col gap-4 overflow-y-auto"
        >
          {icps.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center py-8">
              <p className="text-sm text-gray-500">No relevant profiles found</p>
            </div>
          ) : (
            icps.map((employee) => (
              <RelevantProfileItem
                key={employee.icp_id}
                employee={employee}
                onGenerateEmail={onGenerateEmail}
                disableGenerateEmail={selectedEmployee?.icp_id === employee.icp_id && generatingEmail}
                emailData={employee.icp_id === selectedEmployee?.icp_id ? emailData : undefined}
                bodyHtmlRef={bodyHtmlRef}
                generatingEmail={employee.icp_id === selectedEmployee?.icp_id ? generatingEmail : false}
                onShowEmail={employee.icp_id === selectedEmployee?.icp_id ? onShowEmail : undefined}
                loadingEmail={employee.icp_id === selectedEmployee?.icp_id ? loadingEmail : false}
                onCancelEmail={onCancelEmail}
              />
            ))
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RelevantProfilesContent;
