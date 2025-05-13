import { trackError } from '@meaku/core/utils/error';
import { getTenantIdentifier } from '@meaku/core/utils/index';
import { useEffect } from 'react';
import SomethingWentWrongIcon from '@breakout/design-system/components/icons/something-went-wrong-icon';
import toast from 'react-hot-toast';
import Button from '@breakout/design-system/components/Button/index';
import RestartIcon from '@breakout/design-system/components/icons/restart-icon';
interface ErrorStateProps {
  agentId: number;
}

const ErrorState = ({ agentId }: ErrorStateProps) => {
  useEffect(() => {
    trackError(new Error('Agent configs data is empty or invalid'), {
      action: 'useAgentConfigsQuery Api call',
      component: 'BrandingPage Component',
      additionalData: {
        agentId: agentId,
        tenantName: getTenantIdentifier()?.['tenant-name'],
        errorMessage:
          'Agent configs data is empty or invalid. This could be due to a failed API response or missing configuration data.',
      },
    });

    toast.error('Agent Configs not retrieved. Error reported.', {
      duration: 3000,
    });
  }, []);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-6 p-8">
      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 p-4">
        <SomethingWentWrongIcon className="h-14 w-14 text-primary" />
      </div>
      <div className="text-6xl font-semibold text-system">Something went wrong...</div>
      <p className="max-w-3xl text-center text-base font-medium text-gray-500">
        We couldn’t load this section right now. This might be due to a temporary issue or network error. Please try
        refreshing the page or come back later.
      </p>
      <Button variant="primary" buttonStyle={'rightIcon'} onClick={() => window.location.reload()}>
        Try Again
        <RestartIcon className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default ErrorState;
