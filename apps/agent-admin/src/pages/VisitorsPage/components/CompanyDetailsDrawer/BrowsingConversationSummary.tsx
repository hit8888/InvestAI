import { useState } from 'react';
import { ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';
import AiSparklesIcon from '@breakout/design-system/components/icons/ai-sparkles-icon';
import { CompanyData } from './types';
import Button from '@breakout/design-system/components/Button/index';

type BrowsingConversationSummaryProps = {
  companyData?: CompanyData;
  onSeeAllDetails: () => void;
};

const BrowsingConversationSummary = ({ companyData, onSeeAllDetails }: BrowsingConversationSummaryProps) => {
  const [expanded, setExpanded] = useState(false);
  const { prospect, browsingHistorySummary, conversationSummary } = companyData || {};

  if (!browsingHistorySummary && !conversationSummary) {
    return null;
  }

  return (
    <div className="mt-auto rounded-2xl bg-gradient-to-r from-[#A9A4FF] via-[#DCADFC] to-[#6FC8FC] p-0.5 shadow-md">
      <div className="flex flex-col rounded-2xl bg-white p-3">
        {/* Employee Header */}
        <div className="mb-4 flex items-center justify-between rounded-lg bg-gray-50 p-3">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center">
              <AiSparklesIcon className="h-6 w-5 text-blue-600" />
            </div>
            <h4 className="text-sm font-semibold text-gray-900">User Interaction</h4>
          </div>
          {prospect?.name && (
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 overflow-hidden rounded-full">
                {prospect.avatar ? (
                  <img
                    src={prospect.avatar}
                    alt={`${prospect.name} avatar`}
                    className="h-full w-full rounded-full object-cover"
                  />
                ) : (
                  <div className="border-white/24 flex h-full w-full items-center justify-center rounded-full border-2 bg-purple-100 text-purple-600">
                    <span className="text-xs font-semibold">
                      {prospect.name
                        .split(' ')
                        .map((n) => n.charAt(0))
                        .join('')}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-900">{prospect.name}</span>
                {prospect.title && <div className="h-3 w-px bg-gray-300" />}
                {prospect.title && <span className="text-sm text-gray-500">{prospect.title}</span>}
              </div>
            </div>
          )}
        </div>

        {/* Summary Sections Container */}
        <div className="flex flex-col gap-4">
          {/* Conversation Summary Section */}
          {conversationSummary && (
            <div className="flex flex-col gap-2 overflow-hidden bg-white">
              <p className="text-sm text-gray-700">
                {expanded ? conversationSummary : `${conversationSummary.substring(0, 100)}...`}
              </p>
            </div>
          )}

          {/* Browsing Summary Section */}
          {browsingHistorySummary && (
            <div className="flex flex-col gap-2 overflow-hidden bg-white">
              <p className="text-sm text-gray-700">
                {expanded ? browsingHistorySummary : `${browsingHistorySummary.substring(0, 100)}...`}
              </p>
            </div>
          )}

          <div className="flex items-center justify-between gap-2">
            {companyData?.session_id && (
              <Button
                variant="tertiary"
                size="small"
                rightIcon={<ArrowRight className="h-4 w-4" />}
                onClick={onSeeAllDetails}
              >
                See All Details
              </Button>
            )}

            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1 text-xs font-medium text-blue-600 transition-colors hover:text-blue-700"
            >
              Show {expanded ? 'Less' : 'More'}
              {expanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrowsingConversationSummary;
