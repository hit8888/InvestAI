import { ReachoutEmailResponse } from '@meaku/core/types/admin/api';

import RelevantProfileItem from './RelevantProfileItem';
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
}: RelevantProfilesContentProps) => {
  return (
    <div className="flex flex-col gap-4 overflow-y-auto">
      {icps.map((employee) => (
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
      ))}
    </div>
  );
};

export default RelevantProfilesContent;
