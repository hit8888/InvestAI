import { useState, useEffect } from 'react';
import { getTenantActiveAgentId } from '@meaku/core/utils/index';
import useBrandingAgentConfigsQuery from '../../../queries/query/useAgentConfigsQuery';
import { handleConfigUpdate } from '../../BrandingPage/utils';

/**
 * Custom hook to manage global settings for AI Blocks
 * Handles primary color, font style, and floating bar visibility
 */
export const useGlobalSettings = () => {
  const agentId = getTenantActiveAgentId();

  const {
    data: agentConfigs,
    isLoading,
    refetch,
    isError,
  } = useBrandingAgentConfigsQuery({
    agentId: agentId!,
    enabled: !!agentId,
  });

  const styleConfig = agentConfigs?.configs?.['agent_personalization:style'];
  const commandbarConfig = agentConfigs?.configs?.['command_bar:command_bar'];

  // Local state for form values
  const [primaryColor, setPrimaryColor] = useState<string>('');
  const [fontStyle, setFontStyle] = useState<string>('');
  const [showFloatingBottomBar, setShowFloatingBottomBar] = useState<boolean>(false);

  // Initialize state from agentConfigs when data is loaded
  useEffect(() => {
    if (styleConfig) {
      setPrimaryColor(styleConfig.primary || '#FF9C1A');
      setFontStyle(styleConfig.font_config?.font_family || 'Plus Jakarta Sans');
      setShowFloatingBottomBar(commandbarConfig?.position === 'bottom_center');
    }
  }, [styleConfig, commandbarConfig]);

  /**
   * Helper function to apply Google Fonts URL
   */
  const applyBasicFontUrl = (fontStyle: string) => {
    const formattedFontStyle = fontStyle.trim().replace(/\s+/g, '+');
    return `https://fonts.googleapis.com/css2?family=${formattedFontStyle}`;
  };

  /**
   * Handle primary color update
   */
  const handlePrimaryColorUpdate = async (color: string) => {
    if (!agentId || !agentConfigs) return;

    const currentColor = styleConfig?.primary;

    // Check if the color has actually changed
    if (currentColor === color) {
      return;
    }

    setPrimaryColor(color);

    await handleConfigUpdate(
      agentId,
      {
        configs: {
          'agent_personalization:style': {
            ...agentConfigs?.configs['agent_personalization:style'],
            primary: color,
          },
        },
      },
      agentConfigs,
      refetch,
      'Primary Color',
    );
  };

  /**
   * Handle font style update
   */
  const handleFontStyleUpdate = async (newFontStyle: string | null) => {
    if (!agentId || !agentConfigs || !newFontStyle) return;

    const currentFontFamily = styleConfig?.font_config?.font_family;

    // Check if the font style has actually changed
    if (currentFontFamily === newFontStyle) {
      return;
    }

    setFontStyle(newFontStyle);

    await handleConfigUpdate(
      agentId,
      {
        configs: {
          'agent_personalization:style': {
            ...agentConfigs?.configs['agent_personalization:style'],
            font_config: {
              font_family: newFontStyle,
              font_url: applyBasicFontUrl(newFontStyle),
            },
          },
        },
      },
      agentConfigs,
      refetch,
      'Font Style',
    );
  };

  /**
   * Handle floating bar visibility toggle
   */
  const handleFloatingBarToggle = async (checked: boolean) => {
    if (!agentId || !agentConfigs) return;

    const currentShowBottomBar = commandbarConfig?.position === 'bottom_center';

    // Check if the value has actually changed
    if (currentShowBottomBar === checked) {
      return;
    }

    setShowFloatingBottomBar(checked);

    await handleConfigUpdate(
      agentId,
      {
        configs: {
          'agent_personalization:style': {
            ...agentConfigs?.configs['agent_personalization:style'],
          },
          'command_bar:command_bar': {
            ...agentConfigs?.configs['command_bar:command_bar'],
            position: checked ? 'bottom_center' : 'bottom_right',
          },
        },
      },
      agentConfigs,
      refetch,
      'Floating Bottom Bar',
    );
  };

  return {
    // State
    primaryColor,
    fontStyle,
    showFloatingBottomBar,
    isLoading,
    isError,
    agentConfigs,

    // Handlers
    handlePrimaryColorUpdate,
    handleFontStyleUpdate,
    handleFloatingBarToggle,

    // Local state setters for immediate UI updates
    setPrimaryColor,
    setFontStyle,
    setShowFloatingBottomBar,
  };
};
