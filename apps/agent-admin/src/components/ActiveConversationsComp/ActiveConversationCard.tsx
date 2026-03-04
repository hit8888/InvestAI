import { findFlagUrlByCountryName } from 'country-flags-svg';
import ChipWithIcon from '@breakout/design-system/components/ChipWithIcon/ChipWithIcon';
import moment from 'moment-timezone';
import useTimeAgo from '@neuraltrade/core/hooks/useTimeAgo';
import { ActiveConversation } from '../../context/ActiveConversationsContext';
import BuyerIntentChip from './BuyerIntentChip';
import { Link2 as LinkIcon, Briefcase } from 'lucide-react';
// import { Pin as PinIcon } from 'lucide-react';
// import { cn } from '@breakout/design-system/lib/cn';
import { toSentenceCase } from '@neuraltrade/core/utils/index';
import NumberUtil from '@neuraltrade/core/utils/numberUtils';
import Typography from '@breakout/design-system/components/Typography/index';
import AssignedRoleChip from './AssignedRoleChip';

interface ActiveConversationCardProps {
  conversation: ActiveConversation;
  onCardClick: () => void;
  isPinned?: boolean;
  onTogglePinned?: () => void;
}

const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

const ActiveConversationCard = ({
  conversation,
  onCardClick,
  // isPinned = false,
  // onTogglePinned,
}: ActiveConversationCardProps) => {
  const {
    last_user_message,
    last_message_timestamp,
    buyer_intent,
    prospect: { company, country, company_demographics, browsed_urls, sdr_assignment },
    session,
    webpage_screenshot,
    hasUserLeft,
  } = conversation;
  const { company_revenue, employee_count } = company_demographics;

  const countryFlagUrl = country ? findFlagUrlByCountryName(country) : '';
  const lastMessageTimestamp = last_message_timestamp ? moment.utc(last_message_timestamp).tz(timezone).toDate() : '';
  const timeAgoMessage = useTimeAgo(lastMessageTimestamp);

  const { url: lastBrowsedUrl, timestamp: lastBrowsedUrlTimestamp } = browsed_urls?.[browsed_urls.length - 1] ?? {};
  const source = session?.query_params?.utm_source;

  const screenshotUrl = webpage_screenshot?.public_url;

  return (
    <div
      className="cursor-pointer rounded-lg border border-gray-300 bg-white p-2 transition-shadow hover:shadow-[0px_0px_0px_4px_rgba(220,218,248,1)]"
      onClick={onCardClick}
    >
      <div className="flex justify-between">
        {/* Company logo and name */}
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 overflow-hidden rounded-full">
            {company_demographics?.company_logo_url ? (
              <img
                src={company_demographics.company_logo_url}
                alt={company ?? 'Company Logo'}
                className="h-full w-full object-cover p-2"
              />
            ) : (
              <Briefcase className="h-full w-full p-1.5 text-gray-500" />
            )}
          </div>
          <span className="font-semibold text-gray-900">{company ?? 'Unknown'}</span>
        </div>
        {hasUserLeft ? (
          <Typography variant="caption-12-medium" textColor="error">
            User has left this chat.
          </Typography>
        ) : (
          <Typography variant="caption-12-normal" textColor="gray400">
            Browsing
          </Typography>
        )}

        {/* TODO: Uncomment this when we have a way to pin conversations */}
        {/* User status and pin */}
        {/* <div className="flex items-center gap-1">
          <button
            className={cn(
              'rounded-full p-1 transition-colors',
              isPinned
                ? 'bg-blue-50 text-primary hover:bg-blue-100'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-600',
            )}
            onClick={(e) => {
              e.stopPropagation();
              onTogglePinned?.();
            }}
            title={isPinned ? 'Unpin conversation' : 'Pin conversation'}
          >
            <PinIcon className={cn('h-4 w-4', isPinned ? 'fill-current' : '')} />
          </button>
        </div> */}
      </div>

      {/* Webpage screenshot */}
      {screenshotUrl && (
        <div className="mt-3 h-48 w-full rounded border border-gray-200 2xl:h-72">
          <img src={screenshotUrl} alt="Webpage Screenshot" className="h-full w-full rounded object-cover" />
        </div>
      )}

      {/* 360 View / URL section */}
      {lastBrowsedUrl && (
        <div className="mt-3 flex h-9 items-center justify-between rounded-lg bg-gray-50 p-2">
          <div className="flex w-full flex-1 items-center gap-1">
            <LinkIcon className="h-4 w-4 text-blue-500" />
            <span title={lastBrowsedUrl} className="max-w-[200px] truncate text-xs text-blue-500">
              {lastBrowsedUrl}
            </span>
          </div>
          <div className="flex items-center justify-end gap-1 rounded-full bg-transparent_gray_6 px-1 py-0.5">
            <span className="text-[10px] font-medium text-gray-500">
              Time Spent: {moment().diff(moment(lastBrowsedUrlTimestamp), 'minutes')}:
              {moment().diff(moment(lastBrowsedUrlTimestamp), 'seconds') % 60}
            </span>
          </div>
        </div>
      )}

      {/* Intent, location, and account status */}
      <div className="mt-3 flex flex-wrap gap-3">
        <AssignedRoleChip sdrAssignment={sdr_assignment} />
        <BuyerIntentChip buyerIntent={buyer_intent} />
        <ChipWithIcon name={country} iconUrl={countryFlagUrl} />
      </div>

      {/* Revenue and employee count */}
      <div className="mt-3 flex gap-3">
        <div className="flex-1 rounded-lg bg-gray-50 p-2">
          <span className="block text-xs text-gray-500">Revenue:</span>
          <span className="text-sm text-gray-900">{NumberUtil.formatCurrency(company_revenue)}</span>
        </div>
        <div className="flex-1 rounded-lg bg-gray-50 p-2">
          <span className="block text-xs text-gray-500">Employee count:</span>
          <span className="text-sm text-gray-900">{NumberUtil.formatNumber(employee_count)}</span>
        </div>
      </div>

      {/* Inbound source */}
      {source && (
        <div className="mt-3 flex items-center gap-2">
          <span className="flex-1 text-xs text-gray-500">Inbound source:</span>
          <span className="text-sm text-gray-900">{toSentenceCase(source)}</span>
        </div>
      )}

      {/* Divider */}
      <div className="my-3 h-px bg-gray-200" />

      {/* Last user message section */}
      <div>
        <div className="flex justify-between">
          <span className="text-xs font-medium text-primary">Last user message</span>
          {timeAgoMessage && <span className="text-xs text-gray-400">{timeAgoMessage}</span>}
        </div>
        <p className="mt-1 text-sm text-customPrimaryText">{last_user_message}</p>
      </div>
    </div>
  );
};

export default ActiveConversationCard;
