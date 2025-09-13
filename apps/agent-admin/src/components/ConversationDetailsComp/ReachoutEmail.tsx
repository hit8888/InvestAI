import { useRef } from 'react';
import toast from 'react-hot-toast';

import Button from '@breakout/design-system/components/Button/index';
import AiSparklesIcon from '@breakout/design-system/components/icons/ai-sparkles-icon';
import { Skeleton } from '@breakout/design-system/components/shadcn-ui/skeleton';
import Typography from '@breakout/design-system/components/Typography/index';
import SpinnerIcon from '@breakout/design-system/components/icons/spinner';
import GithubMarkdownRenderer from '@breakout/design-system/components/layout/GithubMarkdownRenderer';
import CopyToClipboardButton from '@breakout/design-system/components/layout/CopyToClipboardButton';
import useReachoutEmail from '../../queries/mutation/useReachoutEmail';
import { ReachoutEmailResponse } from '@meaku/core/types/admin/api';

export const ReachoutEmailBody = ({
  data,
  bodyHtmlRef,
}: {
  data?: ReachoutEmailResponse;
  bodyHtmlRef: React.RefObject<HTMLDivElement | null>;
}) => {
  if (!data) {
    return null;
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex w-full items-center gap-6 rounded-lg border border-gray-200 bg-gray-25 p-3">
        <Typography variant="body-14" className="prose">
          {data?.subject}
        </Typography>
        <CopyToClipboardButton textToCopy={data?.subject ?? ''} btnClassName="ml-auto" />
      </div>
      <div className="flex w-full items-start gap-6 rounded-lg border border-gray-200 bg-gray-25 p-3">
        <span ref={bodyHtmlRef} className="prose text-sm">
          <GithubMarkdownRenderer markdown={data?.main_body ?? ''} />
        </span>
        <CopyToClipboardButton
          textToCopy={data?.main_body ?? ''}
          btnClassName="ml-auto"
          getHtml={() => bodyHtmlRef.current?.innerHTML}
        />
      </div>
    </div>
  );
};

export const ReachoutEmailBodyLoader = () => {
  return (
    <div className="flex flex-col items-center gap-4">
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-24 w-full" />
    </div>
  );
};

export const ReachoutEmailCta = ({
  disabled = false,
  onClick,
  isLoading,
  className,
}: {
  disabled?: boolean;
  onClick: () => void;
  isLoading: boolean;
  className?: string;
}) => {
  return (
    <Button variant="secondary" size="small" disabled={disabled} onClick={onClick} className={className}>
      Generate Email
      {isLoading ? <SpinnerIcon className="h-4 w-4 animate-spin" /> : <AiSparklesIcon className="h-4 w-4" />}
    </Button>
  );
};

const ReachoutEmail = ({ sessionId }: { sessionId?: string }) => {
  const { mutate, isPending, isSuccess, data } = useReachoutEmail({
    onError: () => {
      toast.error('Failed to generate reachout email.');
    },
  });
  const bodyHtmlRef = useRef<HTMLDivElement | null>(null);

  const showContentContainer = isPending || isSuccess;

  const handleGenerateReachoutEmail = () => {
    if (sessionId) {
      mutate({ session_id: sessionId });
    }
  };

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex w-full items-center justify-between gap-2">
        <Typography variant="label-14-medium" className="text-gray-500">
          {isSuccess ? 'Copy paste below email to reach out' : 'Quick Email Setup'}
        </Typography>
        <ReachoutEmailCta
          disabled={isPending || isSuccess || !sessionId}
          onClick={handleGenerateReachoutEmail}
          isLoading={isPending}
        />
      </div>
      {showContentContainer &&
        (isSuccess ? <ReachoutEmailBody data={data} bodyHtmlRef={bodyHtmlRef} /> : <ReachoutEmailBodyLoader />)}
    </div>
  );
};

export default ReachoutEmail;
