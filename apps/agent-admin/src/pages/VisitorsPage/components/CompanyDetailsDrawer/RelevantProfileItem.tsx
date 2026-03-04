import { cn } from '@breakout/design-system/lib/cn';
import { Employee } from './types';
import {
  ReachoutEmailBody,
  ReachoutEmailBodyLoader,
  ReachoutEmailCta,
} from '../../../../components/common/ReachoutEmail';
import EmployeeAvatar from './EmployeeAvatar';
import { ReachoutEmailResponse } from '@neuraltrade/core/types/admin/api';
import SpinnerIcon from '@breakout/design-system/components/icons/spinner';
import LinkedInIcon from '@breakout/design-system/components/icons/linkedin-icon';
import Button from '@breakout/design-system/components/Button/index';

type RelevantProfileItemProps = {
  employee: Employee;
  onGenerateEmail: (employee: Employee) => void;
  disableGenerateEmail: boolean;
  emailData?: ReachoutEmailResponse;
  bodyHtmlRef: React.RefObject<HTMLDivElement | null>;
  generatingEmail: boolean;
  onShowEmail?: (employee: Employee) => void;
  loadingEmail: boolean;
  onCancelEmail: () => void;
};

const RelevantProfileItem = ({
  employee,
  onGenerateEmail,
  disableGenerateEmail,
  emailData,
  bodyHtmlRef,
  generatingEmail,
  onShowEmail,
  loadingEmail,
  onCancelEmail,
}: RelevantProfileItemProps) => {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-gray-50/50 p-3.5">
      <div className="flex items-center gap-4">
        <div className="relative h-8 w-8 rounded-full">
          <EmployeeAvatar avatar={employee.avatar} name={employee.name} />
          {employee.linkedin && (
            <a
              href={employee.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#0A66C2] p-1"
            >
              <LinkedInIcon className="h-full w-full text-white" />
            </a>
          )}
        </div>

        <div className={cn('flex flex-1 flex-col gap-1')}>
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between gap-2">
              <div className="flex flex-col gap-1">
                <h3 className={cn('font-medium text-gray-900', 'text-sm')}>{employee.name}</h3>
                <span className="text-sm text-gray-500">{employee.title}</span>
              </div>
              {emailData ? (
                <Button onClick={onCancelEmail} variant="system">
                  Cancel
                </Button>
              ) : (
                <ReachoutEmailCta
                  disabled={disableGenerateEmail}
                  onClick={() => onGenerateEmail(employee)}
                  isLoading={generatingEmail}
                  className="flex-shrink-0"
                />
              )}
            </div>
            {!employee.email && onShowEmail && (
              <span className="cursor-pointer text-sm text-blue_sec-1000" onClick={() => onShowEmail(employee)}>
                {loadingEmail ? <SpinnerIcon className="h-4 w-4 animate-spin" /> : 'Show Email'}
              </span>
            )}
            {employee.email && (
              <span className="text-sm text-gray-500">
                Email: <span className="text-blue_sec-1000 underline">{employee.email}</span>
              </span>
            )}
          </div>
        </div>
      </div>
      {generatingEmail ? <ReachoutEmailBodyLoader /> : <ReachoutEmailBody data={emailData} bodyHtmlRef={bodyHtmlRef} />}
    </div>
  );
};

export default RelevantProfileItem;
