import useConfigurationApiResponseManager from '@meaku/core/hooks/useConfigurationApiResponseManager';

const useValuesFromConfigApi = () => {
  const configurationApiResponseManager = useConfigurationApiResponseManager();
  const { banner_config, entry_point_alignment } = configurationApiResponseManager.getStyleConfig();
  const agentName = configurationApiResponseManager.getAgentName();
  const orgName = configurationApiResponseManager.getOrgName();
  const ctaConfig = configurationApiResponseManager.getCTAConfig();
  const logoURL = configurationApiResponseManager.getLogoUrl() ?? '';
  const invertTextColor = configurationApiResponseManager.applyInvertTextColor();
  const defaultArtifactUrl = configurationApiResponseManager.getDefaultArtifactUrl();
  const initialSuggestedQuestions = configurationApiResponseManager.getInitialSuggestedQuestions();
  const orbConfig = configurationApiResponseManager.getOrbConfig();
  const orbLogoUrl = orbConfig?.logo_url ?? undefined;
  // If we need to show orb, we need to set show_orb to true in the agent server config
  const showOrb = orbConfig?.show_orb || false;
  return {
    banner_config,
    entry_point_alignment,
    agentName,
    orgName,
    initialSuggestedQuestions,
    invertTextColor,
    orbConfig,
    orbLogoUrl,
    showOrb,
    ctaConfig,
    logoURL,
    defaultArtifactUrl,
  };
};

export default useValuesFromConfigApi;
