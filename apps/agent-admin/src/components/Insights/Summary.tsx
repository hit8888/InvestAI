import AiSparklesIcon from '@breakout/design-system/components/icons/ai-sparkles-icon';
import GithubMarkdownRenderer from '@breakout/design-system/components/layout/GithubMarkdownRenderer';
import { Skeleton } from '@breakout/design-system/components/shadcn-ui/skeleton';
import { getTenantFromLocalStorage } from '@meaku/core/utils/index';
import useInsightsSummaryQuery from '../../queries/query/useInsightsSummaryQuery';

interface SummaryProps {
  start_date: string;
  end_date: string;
  timezone: string;
}

const Summary = ({ start_date, end_date, timezone }: SummaryProps) => {
  const tenantName = getTenantFromLocalStorage();

  const { data: insightSummary, isLoading: isSummaryLoading } = useInsightsSummaryQuery({
    start_date,
    end_date,
    timezone,
  });

  return (
    <div className="py-6">
      <div className="rounded-2xl bg-gradient-to-r from-blue-700 via-pink-500 to-sky-400 p-0.5">
        <div className="rounded-2xl bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="abc flex items-center gap-2">
              <AiSparklesIcon className="h-6 w-5" />
              <h2 className="text-lg font-semibold text-gray-900">
                Summary of Key Findings for <span className="capitalize">{tenantName}</span>:
              </h2>
            </div>

            {!isSummaryLoading && insightSummary?.summary?.length ? (
              <div className="flex items-center gap-1 rounded-full border border-purple-200 bg-primary/2.5 px-3 py-1 text-sm text-bluegray-700">
                <AiSparklesIcon className="h-6 w-5" />
                <span>AI Generated</span>
              </div>
            ) : null}
          </div>

          {isSummaryLoading ? <SummaryShimmer /> : <SummaryContent summary={insightSummary?.summary} />}
        </div>
      </div>
    </div>
  );
};

const SummaryShimmer = () => {
  return (
    <div className="space-y-3">
      <Skeleton className="h-6 w-[40%]" />
      <Skeleton className="h-6 w-[60%]" />
      <Skeleton className="h-6 w-[80%]" />
      <Skeleton className="h-6 w-[100%]" />
    </div>
  );
};

const SummaryContent = ({ summary }: { summary?: string }) => {
  return (
    <div className="space-y-3">
      {summary ? (
        <p className="text-sm leading-relaxed text-gray-900">
          <GithubMarkdownRenderer markdown={summary} />
        </p>
      ) : (
        <div className="block pl-7 text-sm text-gray-400">No summary available.</div>
      )}
    </div>
  );
};

export default Summary;
