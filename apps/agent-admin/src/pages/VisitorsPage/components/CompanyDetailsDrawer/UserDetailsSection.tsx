import { Employee } from './types';
import Typography from '@breakout/design-system/components/Typography/index';
import EmployeeAvatar from './EmployeeAvatar';
import { ReachoutEmailCta } from '../../../../components/common/ReachoutEmail';
import { findFlagUrlByCountryName } from 'country-flags-svg';
import CopyToClipboardButton from '@breakout/design-system/components/layout/CopyToClipboardButton';
import LinkedInIcon from '@breakout/design-system/components/icons/linkedin-icon';
import { cn } from '@breakout/design-system/lib/cn';

type UserDetailsSectionProps = {
  prospect?: Employee;
  onGenerateEmail: (employee: Employee) => void;
  onViewBrowsingHistory: () => void;
  showViewBrowsingHistory: boolean;
  isGeneratingEmail: boolean;
};

const UserDetailsSection = ({
  prospect,
  onGenerateEmail,
  onViewBrowsingHistory,
  showViewBrowsingHistory,
  isGeneratingEmail,
}: UserDetailsSectionProps) => {
  if (!prospect) {
    return null;
  }

  const locationDisplayValue =
    [prospect.location?.city, prospect.location?.country].filter((part) => part && part !== '-').join(', ') || '-';

  return (
    <div className="relative flex">
      <div className="absolute -top-[45px] left-[4px]">
        <svg width="17" height="55" viewBox="0 0 17 55" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M1 0H17H1ZM17 54.5H9C4.30558 54.5 0.5 50.6944 0.5 46H1.5C1.5 50.1421 4.85786 53.5 9 53.5H17V54.5ZM9 54.5C4.30558 54.5 0.5 50.6944 0.5 46V0H1.5V46C1.5 50.1421 4.85786 53.5 9 53.5V54.5ZM17 0V54V0Z"
            fill="#EAECF0"
          />
        </svg>
      </div>

      <div className="ml-6 w-full">
        <Typography variant="caption-12-medium" className="mb-2 flex items-center">
          User Details
        </Typography>

        <div className="flex flex-col gap-2.5 rounded-2xl border border-gray-200 bg-gray-25 p-4">
          <div className="flex items-end gap-4">
            {(prospect.avatar || prospect.name) && (
              <div className="border-white/24 h-[42px] w-[42px] overflow-hidden rounded-full border-2">
                <EmployeeAvatar avatar={prospect.avatar} name={prospect.name} />
              </div>
            )}

            <div className="flex flex-1 flex-col gap-1">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-3">
                  <Typography variant="label-16-medium" className={cn('text-gray-900', { capitalize: prospect.name })}>
                    {prospect.name || 'No user name available'}
                  </Typography>
                  {prospect.title && (
                    <>
                      <div className="h-4 w-0 border-l border-gray-300" />
                      <Typography variant="body-14" className="capitalize text-gray-500">
                        {prospect.title}
                      </Typography>
                    </>
                  )}
                  {prospect.linkedin && (
                    <a
                      href={prospect.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-5 w-5 items-center justify-center rounded-full border-[0.77px] border-[#0A66C2] bg-[#0A66C2]"
                    >
                      <LinkedInIcon className="h-2.5 w-2.5 text-white" />
                    </a>
                  )}
                </div>
                {prospect.email && (
                  <div className="flex items-center gap-1">
                    <Typography variant="caption-12-normal" className="text-gray-500">
                      Email:
                    </Typography>
                    <Typography variant="caption-12-normal" className="text-blue_sec-1000">
                      {prospect.email}
                    </Typography>
                  </div>
                )}
              </div>
            </div>

            {!!prospect.buyer_intent_score && (
              <div
                className={cn('rounded-2xl bg-pink-100 px-2 py-1', {
                  'bg-positive-100': prospect.buyer_intent_score > 0,
                })}
              >
                <div className="flex items-center gap-1">
                  <Typography variant="caption-12-normal" className="text-gray-500">
                    Intent Score:
                  </Typography>
                  <Typography
                    variant="caption-12-normal"
                    className={cn('text-pink-1000', {
                      'text-positive-1000': prospect.buyer_intent_score > 0,
                    })}
                  >
                    {prospect.buyer_intent_score}
                  </Typography>
                </div>
              </div>
            )}
          </div>

          <div className="h-[1px] w-full bg-gray-100" />

          <div className="flex flex-col gap-2">
            <div className="flex justify-between gap-4">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Typography variant="caption-12-normal" className="text-gray-500">
                      Location:
                    </Typography>
                    <Typography variant="caption-12-normal" className="capitalize text-gray-900">
                      {locationDisplayValue}
                      &nbsp;
                      {prospect.location?.country && (
                        <img
                          src={findFlagUrlByCountryName(prospect.location.country)}
                          width={16}
                          height={16}
                          alt="flag-icon"
                          className="inline overflow-hidden"
                        />
                      )}
                    </Typography>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {prospect.prospect_id && (
                  <CopyToClipboardButton
                    textToCopy={prospect.prospect_id}
                    toastMessage="Prospect ID copied to clipboard"
                    btnClassName="flex items-center gap-2 rounded-2xl bg-gray-100 w-28 h-6"
                    copyIconClassname="w-3 h-3"
                  >
                    <Typography variant="caption-12-normal" className="text-gray-500">
                      Prospect ID
                    </Typography>
                  </CopyToClipboardButton>
                )}

                {prospect.ipAddress && (
                  <CopyToClipboardButton
                    textToCopy={prospect.ipAddress}
                    toastMessage="IP Address copied to clipboard"
                    btnClassName="flex items-center gap-2 rounded-2xl bg-gray-100 w-28 h-6"
                    copyIconClassname="w-3 h-3"
                  >
                    <Typography variant="caption-12-normal" className="text-gray-500">
                      IP Address
                    </Typography>
                  </CopyToClipboardButton>
                )}
              </div>
            </div>

            <div className="flex justify-between">
              <ReachoutEmailCta
                onClick={() => onGenerateEmail(prospect)}
                isLoading={isGeneratingEmail}
                disabled={isGeneratingEmail}
              />

              {showViewBrowsingHistory && (
                <button className="cursor-pointer text-primaryV2 underline" onClick={onViewBrowsingHistory}>
                  <Typography variant="caption-12-medium" className="text-primary">
                    ← View Browsing History
                  </Typography>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsSection;
