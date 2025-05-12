import { trackError } from '@meaku/core/utils/error';
import { getTenantIdentifier } from '@meaku/core/utils/index';
import { useEffect } from 'react';
import toast from 'react-hot-toast';

interface BrandingErrorStateProps {
  agentId: number;
}

const BrandingPageErrorState = ({ agentId }: BrandingErrorStateProps) => {
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
    <div className="flex h-full w-full flex-col items-center justify-center gap-4 p-8">
      <div className="text-lg font-semibold text-destructive-1000">Branding Configuration Required</div>
      <p className="max-w-md text-center font-medium text-system">Error getting page details. Please contact support</p>
    </div>
  );
};

export default BrandingPageErrorState;
