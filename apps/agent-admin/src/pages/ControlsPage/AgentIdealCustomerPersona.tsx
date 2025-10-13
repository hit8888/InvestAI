import React from 'react';
import Card from '../../components/AgentManagement/Card.tsx';
import { CommonControlsProps } from './utils';
import PromptHeader from './PromptHeader';
import { useIcpData, useIcpForm, useIcpRenderers } from './hooks';
import { LoadingState, ErrorState, IcpForm } from './components';

const AgentIdealCustomerPersona = React.memo(({ title, description }: CommonControlsProps) => {
  // Custom hooks for data management, form handling, and rendering
  const {
    agentId,
    transformedFormData,
    options,
    isLoadingConfig,
    configError,
    saveIcpConfig,
    isSaving,
    refetchIcpConfig,
  } = useIcpData();

  const { control, handleSubmit, errors, canSave } = useIcpForm(transformedFormData, saveIcpConfig);

  const { selectFields, numberFields, renderDropdownField, renderNumberField } = useIcpRenderers({
    control,
    errors,
    options,
  });

  // Show loading state while fetching config
  if (isLoadingConfig) {
    return <LoadingState title={title} description={description} />;
  }

  // Show error state if config fetch failed
  if (configError) {
    return (
      <ErrorState
        errorMessage="Error loading ICP configuration. Please try again"
        title={title}
        description={description}
        refetch={refetchIcpConfig}
      />
    );
  }

  return (
    <div className="flex w-full flex-col items-start gap-4 self-stretch">
      <PromptHeader title={title} description={description} />
      <Card background={'GRAY25'} border={'GRAY200'}>
        <IcpForm
          handleSubmit={handleSubmit}
          selectFields={selectFields}
          numberFields={numberFields}
          renderDropdownField={renderDropdownField}
          renderNumberField={renderNumberField}
          canSave={canSave}
          isSaving={isSaving}
          agentId={agentId}
        />
      </Card>
    </div>
  );
});

AgentIdealCustomerPersona.displayName = 'AgentIdealCustomerPersona';

export default AgentIdealCustomerPersona;
