import {
  AgentConfigPayload,
  agentConfigPayloadSchema,
  AgentConfigResponse,
} from '@neuraltrade/core/types/admin/agent-configs';
import { updateBrandingAgentConfigs } from '@neuraltrade/core/adminHttp/api';
import toast from 'react-hot-toast';
import { trackError } from '@neuraltrade/core/utils/error';
import { deepCompare } from '@neuraltrade/core/utils/index';
import { useSessionStore } from '../../stores/useSessionStore';

// Utility function to extract field-specific error messages
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const extractFieldError = (error: any): string | null => {
  try {
    // Handle nested error structure like the one you showed
    if (error?.configs?.['agent_personalization:style']?.font_config?.font_url) {
      const fontErrors = error.configs['agent_personalization:style'].font_config.font_url;
      if (Array.isArray(fontErrors) && fontErrors.length > 0) {
        return fontErrors[0]; // Return the first error message
      }
    }

    // Handle orb config errors
    if (error?.configs?.['agent_personalization:style']?.orb_config) {
      const orbErrors = error.configs['agent_personalization:style'].orb_config;
      for (const [key, value] of Object.entries(orbErrors)) {
        if (Array.isArray(value) && value.length > 0) {
          return `${key}: ${value[0]}`;
        }
      }
    }

    // Handle other nested config errors
    if (error?.configs?.['agent_personalization:style']) {
      const styleErrors = error.configs['agent_personalization:style'];
      for (const [key, value] of Object.entries(styleErrors)) {
        if (key !== 'font_config' && key !== 'orb_config' && Array.isArray(value) && value.length > 0) {
          return `${key}: ${value[0]}`;
        }
      }
    }

    // Handle top-level config errors
    if (error?.configs) {
      for (const [key, value] of Object.entries(error.configs)) {
        if (key !== 'agent_personalization:style' && Array.isArray(value) && value.length > 0) {
          return `${key}: ${value[0]}`;
        }
      }
    }

    // Fallback to general error message
    if (error?.message) {
      return error.message;
    }

    return null;
  } catch (parseError) {
    console.error('Error parsing field error:', parseError);
    return null;
  }
};

const DEFAULT_FONT_CONFIG = {
  font_family: 'Inter',
  font_url: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
};

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

  const orbLogoUrl = updateFieldValues?.orb_config?.logo_url ?? agentConfigsValues?.orb_config?.logo_url ?? null;

  try {
    const payload: AgentConfigPayload = {
      name: updateField.name ?? agentConfigs.name,
      metadata: {
        ...agentConfigs.metadata,
        logo: updateField.metadata?.logo ?? agentConfigs.metadata.logo,
        welcome_message: {
          ...agentConfigs.metadata.welcome_message,
          message: updateField.metadata?.welcome_message?.message ?? agentConfigs.metadata.welcome_message.message,
        },
      },
      configs: {
        'agent_personalization:style': {
          ...agentConfigsValues,
          primary: updateFieldValues?.primary ?? agentConfigsValues.primary,
          secondary: updateFieldValues?.secondary ?? agentConfigsValues.secondary,
          orb_config: {
            logo_url: orbLogoUrl,
            show_orb: orbLogoUrl
              ? (updateFieldValues?.orb_config?.show_orb ?? agentConfigsValues?.orb_config?.show_orb ?? false)
              : true, // logo_url shouldn't be null when show_orb is false and vice versa
          },
          font_config: {
            font_family:
              updateFieldValues?.font_config?.font_family ??
              agentConfigsValues?.font_config?.font_family ??
              DEFAULT_FONT_CONFIG.font_family,
            font_url:
              updateFieldValues?.font_config?.font_url ??
              agentConfigsValues?.font_config?.font_url ??
              DEFAULT_FONT_CONFIG.font_url,
          },
        },
        'command_bar:command_bar': {
          ...(agentConfigs.configs['command_bar:command_bar'] ?? {}),
          position:
            (updateField.configs?.['command_bar:command_bar']?.position ??
              agentConfigs.configs['command_bar:command_bar']?.position) ||
            'bottom_right',
        },
      },
    };

    // Check if the new payload is different from the current configs
    const nameChanged = payload.name !== agentConfigs.name;
    const logoChanged = payload.metadata.logo !== agentConfigs.metadata.logo;
    const styleChanged = !deepCompare(
      agentConfigs.configs['agent_personalization:style'],
      payload.configs['agent_personalization:style'],
    );
    // If no changes detected, skip the API call
    if (!nameChanged && !logoChanged && !styleChanged) {
      return;
    }
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
        tenantName: useSessionStore.getState().activeTenant?.['tenant-name'],
        errorMessage: 'Unable to update branding page agent configs',
      },
    });
    // Extract field-specific error message
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const fieldError = extractFieldError((error as any)?.response?.data);
    const errorMessage = fieldError
      ? `Error updating ${fieldName}: ${fieldError}`
      : `Error updating ${fieldName}. Please try again.`;

    toast.error(errorMessage);
    console.error('Error updating agent configs', error);
  }
};
