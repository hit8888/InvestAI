import AiSparklesIcon from '@breakout/design-system/components/icons/ai-sparkles-icon';
import { cn } from '@breakout/design-system/lib/cn';
import {
  ReachoutEmailBody,
  ReachoutEmailBodyLoader,
} from '../../../../components/ConversationDetailsComp/ReachoutEmail';
import { ReachoutEmailResponse } from '@meaku/core/types/admin/api';
import { Employee } from './types';
import EmployeeAvatar from './EmployeeAvatar';
import SpinnerIcon from '@breakout/design-system/components/icons/spinner';

type GeneratedEmailCardProps = {
  selectedEmployee?: Employee | null;
  emailData?: ReachoutEmailResponse;
  emailDataLoading: boolean;
  bodyHtmlRef: React.RefObject<HTMLDivElement | null>;
  isLoadingIcpDetails: boolean;
  fetchIcpDetails: () => void;
};

const GeneratedEmailCard = ({
  selectedEmployee,
  emailData,
  bodyHtmlRef,
  isLoadingIcpDetails,
  fetchIcpDetails,
}: GeneratedEmailCardProps) => {
  if (!selectedEmployee) return null;
  return (
    <>
      <div className="flex items-center gap-2 border-b border-gray-200 pb-4">
        <AiSparklesIcon className="size-6" />
        <span className="text-sm font-medium text-gray-900">Generated Email</span>
      </div>
      <div className="flex items-center gap-2 py-2">
        <span className="text-sm font-light text-gray-500">for:</span>
        <div className="h-8 w-8 overflow-hidden rounded-full">
          <EmployeeAvatar avatar={selectedEmployee?.avatar ?? ''} name={selectedEmployee?.name ?? ''} />
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <h3 className={cn('text-sm font-light text-gray-900')}>{selectedEmployee?.name}</h3>
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
        {!selectedEmployee?.email && (
          <span className="ml-auto cursor-pointer px-2 text-sm font-medium text-primary" onClick={fetchIcpDetails}>
            {isLoadingIcpDetails ? <SpinnerIcon className="h-4 w-4 animate-spin" /> : 'Show Email'}
          </span>
        )}
      </div>
      {emailData ? <ReachoutEmailBody data={emailData} bodyHtmlRef={bodyHtmlRef} /> : <ReachoutEmailBodyLoader />}
    </>
  );
};

export default GeneratedEmailCard;
