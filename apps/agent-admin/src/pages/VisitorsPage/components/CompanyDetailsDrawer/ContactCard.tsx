import { Linkedin } from 'lucide-react';
import { findFlagUrlByCountryName } from 'country-flags-svg';
import InfoChip from './InfoChip';
import { cn } from '@breakout/design-system/lib/cn';
import { Employee } from './types';
import { ReachoutEmailResponse } from '@meaku/core/types/admin/api';
import {
  ReachoutEmailBody,
  ReachoutEmailBodyLoader,
  ReachoutEmailCta,
} from '../../../../components/ConversationDetailsComp/ReachoutEmail';
import { useRef } from 'react';

type ContactCardProps = {
  employee: Employee;
  variant?: 'large' | 'small';
  onGenerateEmail?: (employeeId: string) => void;
  emailData?: ReachoutEmailResponse;
  emailDataLoading?: boolean;
  showGenerateEmailButton?: boolean;
};

const ContactCard = ({
  employee,
  variant = 'large',
  onGenerateEmail,
  emailData,
  emailDataLoading,
  showGenerateEmailButton = false,
}: ContactCardProps) => {
  const bodyHtmlRef = useRef<HTMLDivElement | null>(null);
  const isLarge = variant === 'large';
  const showInfoChips = employee.email || employee.location || employee.linkedin;

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-gray-50/50 p-3.5">
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <div className="h-8 w-8 overflow-hidden rounded-full">
          {employee.avatar ? (
            <img
              src={employee.avatar}
              alt={`${employee.name} avatar`}
              className="h-full w-full rounded-full object-cover"
            />
          ) : (
            <div className="border-white/24 flex h-full w-full items-center justify-center rounded-full border-2 bg-purple-100 text-purple-600">
              <span className="text-sm font-semibold">
                {employee.name
                  .split(' ')
                  .map((n) => n.charAt(0))
                  .join('')}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div
          className={cn('flex flex-1 flex-col gap-1', {
            'flex-row justify-between': !isLarge && onGenerateEmail,
          })}
        >
          {/* Name and Title */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <h3 className={`font-medium text-gray-900 ${isLarge ? 'text-base' : 'text-sm'}`}>{employee.name}</h3>
              {employee.title && (
                <>
                  <div className="h-4 w-0 border-l border-gray-300" />
                  <span className="text-sm text-gray-500">{employee.title}</span>
                </>
              )}
              {isLarge && showGenerateEmailButton && (
                <ReachoutEmailCta
                  disabled={!!emailData || emailDataLoading}
                  onClick={() => onGenerateEmail?.(employee.id)}
                  isLoading={emailDataLoading ?? false}
                  className="ml-auto"
                />
              )}
            </div>
          </div>

          {/* Generate Email Button */}
          {!isLarge && showGenerateEmailButton && (
            <ReachoutEmailCta
              disabled={!!emailData || emailDataLoading}
              onClick={() => onGenerateEmail?.(employee.id)}
              isLoading={emailDataLoading ?? false}
              className="ml-auto"
            />
          )}

          {/* Info Chips for large variant */}
          {isLarge && showInfoChips && (
            <div className="flex flex-wrap gap-2">
              {employee.linkedin && (
                <div className="flex items-center gap-1 rounded-2xl border border-blue-600 bg-blue-600 px-2 py-1">
                  <Linkedin className="h-4 w-4 text-white" />
                  <span className="text-sm font-medium text-white">Linkedin Profile</span>
                </div>
              )}
              {/* {employee.timeSpent && <InfoChip label="Time spend" value={employee.timeSpent} />} */}
              {/* {employee.visits && <InfoChip label="Visits" value={employee.visits.toString()} />} */}
              {employee.location && (
                <InfoChip
                  label="Location"
                  value={employee.location}
                  iconUrl={findFlagUrlByCountryName(employee.location)}
                />
              )}
              {employee.email && <InfoChip label="Email" value={employee.email} isLink />}
            </div>
          )}
        </div>
      </div>
      {emailDataLoading ? (
        <ReachoutEmailBodyLoader />
      ) : (
        <ReachoutEmailBody data={emailData} bodyHtmlRef={bodyHtmlRef} />
      )}
    </div>
  );
};

export default ContactCard;
