import {
  AgentConfigPayload,
  agentConfigPayloadSchema,
  AgentConfigResponse,
} from '@meaku/core/types/admin/agent-configs';
import { updateBrandingAgentConfigs } from '../../admin/api';
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
  try {
    const payload: AgentConfigPayload = {
      name: updateField.name ?? agentConfigs.name,
      metadata: {
        ...agentConfigs.metadata,
        logo: updateField.metadata?.logo ?? agentConfigs.metadata.logo,
      },
      configs: {
        'agent_personalization:style': {
          ...agentConfigs.configs['agent_personalization:style'],
          primary:
            updateField.configs?.['agent_personalization:style']?.primary ??
            agentConfigs.configs['agent_personalization:style'].primary,
          secondary:
            updateField.configs?.['agent_personalization:style']?.secondary ??
            agentConfigs.configs['agent_personalization:style'].secondary,
          orb_config: {
            logo_url:
              updateField.configs?.['agent_personalization:style']?.orb_config?.logo_url ??
              agentConfigs.configs['agent_personalization:style']?.orb_config?.logo_url ??
              null,
            show_orb:
              updateField.configs?.['agent_personalization:style']?.orb_config?.show_orb ??
              agentConfigs.configs['agent_personalization:style']?.orb_config?.show_orb ??
              !!(agentConfigs.configs['agent_personalization:style']?.orb_config?.logo_url ?? null), // logo_url shouldn't be null when show_orb is false
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
        agentId: agentId,
        tenantName: getTenantIdentifier()?.['tenant-name'],
        errorMessage: 'Unable to update branding page agent configs',
      },
    });
    toast.error('Please check if mandatory fields are filled.');
    console.error('Error updating agent configs', error);
  }
};
