import { cn } from '@breakout/design-system/lib/cn';
import { ReachoutEmailBody, ReachoutEmailBodyLoader } from '../../../../components/common/ReachoutEmail';
import { ReachoutEmailResponse } from '@meaku/core/types/admin/api';
import { Employee } from './types';
import EmployeeAvatar from './EmployeeAvatar';

type GeneratedEmailCardProps = {
  selectedEmployee?: Employee | null;
  emailData?: ReachoutEmailResponse;
  emailDataLoading: boolean;
  bodyHtmlRef: React.RefObject<HTMLDivElement | null>;
  isLoadingIcpDetails: boolean;
  fetchIcpDetails: () => void;
};

const GeneratedEmailCard = ({ selectedEmployee, emailData, bodyHtmlRef }: GeneratedEmailCardProps) => {
  return (
    <>
      <div className="flex items-center gap-2 py-2">
        <span className="text-sm font-light text-gray-500">for:</span>
        {selectedEmployee?.name ||
          (selectedEmployee?.avatar && (
            <div className="h-8 w-8 flex-shrink-0 overflow-hidden rounded-full">
              <EmployeeAvatar avatar={selectedEmployee?.avatar ?? ''} name={selectedEmployee?.name ?? ''} />
            </div>
          ))}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <h3 className={cn('text-sm font-light text-gray-900')}>
              {selectedEmployee?.name || 'No user name available'}
            </h3>
            {selectedEmployee?.title && (
              <>
                <div className="h-4 w-0 border-l border-gray-300" />
                <span className="text-sm font-light text-gray-500">{selectedEmployee.title}</span>
              </>
            )}
          </div>
          {selectedEmployee?.email && (
            <span className="text-sm font-light text-blue_sec-1000">{selectedEmployee.email}</span>
          )}
        </div>
      </div>
      {emailData ? <ReachoutEmailBody data={emailData} bodyHtmlRef={bodyHtmlRef} /> : <ReachoutEmailBodyLoader />}
    </>
  );
};

export default GeneratedEmailCard;
