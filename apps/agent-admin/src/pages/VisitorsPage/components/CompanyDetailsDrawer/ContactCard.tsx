import { Linkedin } from 'lucide-react';
import { findFlagUrlByCountryName } from 'country-flags-svg';
import InfoChip from './InfoChip';
import { cn } from '@breakout/design-system/lib/cn';
import { Employee } from './types';
import { ReachoutEmailCta } from '../../../../components/ConversationDetailsComp/ReachoutEmail';
import EmployeeAvatar from './EmployeeAvatar';

type ContactCardProps = {
  employee: Employee;
  showGenerateEmailButton?: boolean;
  onGenerateEmail: (employee: Employee) => void;
  disableEmailButton: boolean;
};

const ContactCard = ({
  employee,
  showGenerateEmailButton = false,
  onGenerateEmail,
  disableEmailButton,
}: ContactCardProps) => {
  const isProspectView = !employee.icp_id;
  const showInfoChips = employee.email || employee.location || employee.linkedin;
  const locationDisplayValue = [employee.location?.city, employee.location?.country]
    .filter((part) => part && part !== '-')
    .join(', ');

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-gray-50/50 p-3.5">
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <div className="h-8 w-8 overflow-hidden rounded-full">
          <EmployeeAvatar avatar={employee.avatar} name={employee.name} />
        </div>

        {/* Content */}
        <div className={cn('flex flex-1 flex-col gap-1')}>
          {/* Name and Title */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <div className="flex w-2/3 items-center gap-2">
                <h3 className={cn('font-medium text-gray-900', isProspectView ? 'text-base' : 'text-sm')}>
                  {employee.name}
                </h3>
                {employee.title && (
                  <>
                    <div className="h-4 w-0 border-l border-gray-300" />
                    <span className="text-sm text-gray-500">{employee.title}</span>
                  </>
                )}
              </div>
              {showGenerateEmailButton && (
                <ReachoutEmailCta
                  disabled={disableEmailButton}
                  onClick={() => onGenerateEmail(employee)}
                  isLoading={false}
                  className="ml-auto"
                />
              )}
            </div>
          </div>

          {/* Info Chips for large variant */}
          {isProspectView && showInfoChips && (
            <div className="flex flex-wrap gap-2">
              {employee.linkedin && (
                <div className="flex items-center gap-1 rounded-2xl border border-blue-600 bg-blue-600 px-2 py-1">
                  <Linkedin className="h-4 w-4 text-white" />
                  <span className="text-sm font-medium text-white">Linkedin Profile</span>
                </div>
              )}
              {/* {employee.timeSpent && <InfoChip label="Time spend" value={employee.timeSpent} />} */}
              {/* {employee.visits && <InfoChip label="Visits" value={employee.visits.toString()} />} */}
              {employee.location?.country && (
                <InfoChip
                  label="Location"
                  value={locationDisplayValue}
                  iconUrl={findFlagUrlByCountryName(employee.location.country)}
                />
              )}
              {employee.email && <InfoChip label="Email" value={employee.email} isLink />}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactCard;
