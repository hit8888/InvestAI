import { useRef } from 'react';

import Typography from '@breakout/design-system/components/Typography/index';
import useReachoutEmailQuery from '../../queries/query/useReachoutEmailQuery';
import { ReachoutEmailBody, ReachoutEmailBodyLoader, ReachoutEmailCta } from '../common/ReachoutEmail';

const GenerateReachoutEmailItem = ({ sessionId }: { sessionId?: string }) => {
  const { data, isLoading, refetch, isSuccess } = useReachoutEmailQuery(
    {
      session_id: sessionId,
      email_type: 'website_user',
    },
    {
      enabled: false,
    },
  );
  const bodyHtmlRef = useRef<HTMLDivElement | null>(null);

  const showContentContainer = isLoading || isSuccess;

  const handleGenerateReachoutEmail = () => {
    if (sessionId) {
      refetch();
    }
  };

  return (
    <div className="flex w-full items-start justify-between gap-4 self-stretch rounded-2xl border border-gray-200 bg-primary/2.5 p-4">
      <div className="flex w-full flex-col gap-4">
        <div className="flex w-full items-center justify-between gap-2">
          <Typography variant="label-14-medium" className="text-gray-500">
            {isSuccess ? 'Copy paste below email to reach out' : 'Quick Email Setup'}
          </Typography>
          <ReachoutEmailCta
            disabled={showContentContainer || !sessionId}
            onClick={handleGenerateReachoutEmail}
            isLoading={isLoading}
          />
        </div>
        {showContentContainer &&
          (isLoading ? <ReachoutEmailBodyLoader /> : <ReachoutEmailBody data={data} bodyHtmlRef={bodyHtmlRef} />)}
      </div>
    </div>
  );
};

export default GenerateReachoutEmailItem;
