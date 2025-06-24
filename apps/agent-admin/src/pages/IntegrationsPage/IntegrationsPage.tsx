import { useState } from 'react';

import PageContainer from '../../components/AgentManagement/PageContainer';
import { useIntegrationsQuery } from '../../queries/query/useIntegrationQueries';
import IntegrationCard from './components/IntegrationCard';
import IntegrationForm from '@breakout/design-system/components/layout/IntegrationForm';
import type { Integration } from '@meaku/core/types/admin/api';
import {
  useIntegrationConnect,
  useIntegrationConnectCallback,
  useIntegrationDisconnect,
} from '../../queries/mutation/useIntegrationMutations';
import { useOAuthPopup } from '@meaku/core/hooks/useOAuthPopUp';

const IntegrationsPage = () => {
  const [integrationFormToShow, setIntegrationFormToShow] = useState<Integration | null>(null);
  const { data, isLoading, error } = useIntegrationsQuery();
  const { mutateAsync: connectIntegration, isPending: connectPending } = useIntegrationConnect();
  const { mutateAsync: disconnectIntegration, isPending: disconnectPending } = useIntegrationDisconnect();
  const { mutate: connectIntegrationCallback, isPending: connectCallbackPending } = useIntegrationConnectCallback();
  const { openPopup } = useOAuthPopup({
    onSuccess: (data, metadata) => {
      connectIntegrationCallback({
        code: data.code,
        state: data.state,
        integrationType: metadata?.oAuthType,
      });
    },
  });

  const handleConnectIntegration = async (integrationType: string, formData?: Record<string, string>) => {
    const response = await connectIntegration({
      formData,
      integrationType,
    });
    openPopup(response.login_url, { oAuthType: integrationType });
  };

  const handleToggleIntegrationStatus = (integrationToToggle: Integration) => {
    if (integrationToToggle?.connected) {
      disconnectIntegration({
        integrationType: integrationToToggle.integration_type,
      });
    } else if (integrationToToggle?.integration_form?.length) {
      setIntegrationFormToShow(integrationToToggle);
    } else {
      handleConnectIntegration(integrationToToggle.integration_type);
    }
  };

  const handleIntegrationFormSubmit = (formData: Record<string, string>) => {
    if (!integrationFormToShow) return;

    handleConnectIntegration(integrationFormToShow.integration_type, formData);
    setIntegrationFormToShow(null);
  };

  const handleIntegrationFormClose = () => {
    setIntegrationFormToShow(null);
  };

  return (
    <PageContainer
      heading="Integrations"
      subHeading="Connect third-party tools to streamline your workflows, sync data across platforms, and enhance your product experience."
      isLoading={isLoading}
      error={error}
      className="max-w-full flex-row flex-wrap gap-8"
    >
      {data?.integrations?.map?.((integration) => (
        <IntegrationCard
          key={integration.integration_type}
          data={integration}
          disableToggle={connectPending || disconnectPending || connectCallbackPending}
          onToggle={handleToggleIntegrationStatus}
        />
      ))}
      {integrationFormToShow?.integration_form?.length ? (
        <IntegrationForm
          isOpen
          formFields={integrationFormToShow.integration_form}
          onClose={handleIntegrationFormClose}
          onSubmit={handleIntegrationFormSubmit}
        />
      ) : null}
    </PageContainer>
  );
};

export default IntegrationsPage;
