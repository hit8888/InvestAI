import {
  AgentConfigPayload,
  agentConfigPayloadSchema,
  AgentConfigResponse,
} from '@meaku/core/types/admin/agent-configs';
import { updateBrandingAgentConfigs } from '@meaku/core/adminHttp/api';
import toast from 'react-hot-toast';
import { trackError } from '@meaku/core/utils/error';
import { getTenantIdentifier } from '@meaku/core/utils/index';

// Common update function
export const handleConfigUpdate = async (
  agentId: number,
  updateField: Partial<AgentConfigPayload>,
  agentConfigs: AgentConfigResponse,
  onUpdate: () => void,
  fieldName: string,
) => {
  const agentConfigsValues = agentConfigs.configs['agent_personalization:style'];
  const updateFieldValues = updateField.configs?.['agent_personalization:style'];
  try {
    const payload: AgentConfigPayload = {
      name: updateField.name ?? agentConfigs.name,
      metadata: {
        ...agentConfigs.metadata,
        logo: updateField.metadata?.logo ?? agentConfigs.metadata.logo,
      },
      configs: {
        'agent_personalization:style': {
          ...agentConfigsValues,
          primary: updateFieldValues?.primary ?? agentConfigsValues.primary,
          secondary: updateFieldValues?.secondary ?? agentConfigsValues.secondary,
          orb_config: {
            logo_url: updateFieldValues?.orb_config?.logo_url ?? agentConfigsValues?.orb_config?.logo_url ?? null,
            show_orb:
              updateFieldValues?.orb_config?.show_orb ??
              agentConfigsValues?.orb_config?.show_orb ??
              !!(agentConfigsValues?.orb_config?.logo_url ?? null), // logo_url shouldn't be null when show_orb is false
          },
        },
      },
    };

    // Validate the payload
    const validatedPayload = agentConfigPayloadSchema.parse(payload);
    await updateBrandingAgentConfigs(agentId, validatedPayload);

    toast.success(`${fieldName} updated successfully`, {
      duration: 3000,
    });
    onUpdate();
  } catch (error) {
    trackError(error, {
      action: 'updateBrandingAgentConfigs Api call',
      component: 'handleConfigUpdate function',
      additionalData: {
        updateFieldValues,
        fieldName,
        agentId: agentId,
        tenantName: getTenantIdentifier()?.['tenant-name'],
        errorMessage: 'Unable to update branding page agent configs',
      },
    });
    toast.error(`Error updating agent configs: ${JSON.stringify(error)}`);
    console.error('Error updating agent configs', error);
  }
};
