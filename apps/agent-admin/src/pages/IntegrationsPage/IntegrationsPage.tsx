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
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const { data, isLoading, error } = useIntegrationsQuery();
  const { mutateAsync: connectIntegration } = useIntegrationConnect();
  const { mutateAsync: disconnectIntegration } = useIntegrationDisconnect();
  const { mutate: connectIntegrationCallback } = useIntegrationConnectCallback();
  const { openPopup } = useOAuthPopup({
    onSuccess: (data) => {
      connectIntegrationCallback({
        code: data.code,
        state: data.state,
      });
    },
  });

  const handleConnectIntegration = async (integrationType: string, formData?: Record<string, string>) => {
    const response = await connectIntegration({
      formData,
      integrationType,
    });
    openPopup(response.login_url);
  };

  const handleToggleIntegrationStatus = (integrationToToggle: Integration) => {
    if (integrationToToggle?.connected) {
      disconnectIntegration({
        integrationType: integrationToToggle.integration_type,
      });
      return;
    }

    setSelectedIntegration(integrationToToggle);
    if (!integrationToToggle?.integration_form?.length) {
      handleConnectIntegration(integrationToToggle.integration_type);
    }
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
          onToggle={() => handleToggleIntegrationStatus(integration)}
        />
      ))}
      {selectedIntegration?.integration_form?.length ? (
        <IntegrationForm
          isOpen
          formFields={selectedIntegration.integration_form}
          onClose={() => setSelectedIntegration(null)}
          onSubmit={(formData) => handleConnectIntegration(selectedIntegration.integration_type, formData)}
        />
      ) : null}
    </PageContainer>
  );
};

export default IntegrationsPage;
