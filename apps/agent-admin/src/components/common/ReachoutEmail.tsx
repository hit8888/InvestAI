import Button from '@breakout/design-system/components/Button/index';
import AiSparklesWhiteIcon from '@breakout/design-system/components/icons/ai-sparkles-white';
import { Skeleton } from '@breakout/design-system/components/shadcn-ui/skeleton';
import Typography from '@breakout/design-system/components/Typography/index';
import SpinnerIcon from '@breakout/design-system/components/icons/spinner';
import GithubMarkdownRenderer from '@breakout/design-system/components/layout/GithubMarkdownRenderer';
import CopyToClipboardButton from '@breakout/design-system/components/layout/CopyToClipboardButton';
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
    <div className="flex flex-col items-center gap-4 overflow-y-auto">
      <div className="flex w-full items-center gap-6 rounded-lg border border-gray-200 bg-gray-25 p-3">
        <Typography variant="body-14" className="prose">
          {data?.subject}
        </Typography>
        <CopyToClipboardButton
          textToCopy={data?.subject ?? ''}
          btnClassName="ml-auto"
          copyIconClassname="text-gray-500"
        />
      </div>
      <div className="flex w-full items-start gap-6 rounded-lg border border-gray-200 bg-gray-25 p-3">
        <span ref={bodyHtmlRef} className="prose text-sm">
          <GithubMarkdownRenderer markdown={data?.main_body ?? ''} />
        </span>
        <CopyToClipboardButton
          textToCopy={data?.main_body ?? ''}
          btnClassName="ml-auto"
          getHtml={() => bodyHtmlRef.current?.innerHTML}
          copyIconClassname="text-gray-500"
        />
      </div>
    </div>
  );
};

export const ReachoutEmailBodyLoader = () => {
  return (
    <div className="flex flex-1 flex-col items-center gap-4">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-full min-h-24 w-full" />
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
    <Button
      variant="primary"
      size="small"
      disabled={disabled}
      onClick={onClick}
      className={`!border-black !bg-black hover:!bg-black/80 ${className}`}
    >
      Generate Email
      {isLoading ? <SpinnerIcon className="h-4 w-4 animate-spin" /> : <AiSparklesWhiteIcon className="h-4 w-4" />}
    </Button>
  );
};
