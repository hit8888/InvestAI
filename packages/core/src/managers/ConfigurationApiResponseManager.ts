import { ConfigurationApiResponse } from '../types/api/configuration_response';

export class ConfigurationApiResponseManager {
  protected config: ConfigurationApiResponse;

  constructor(response: ConfigurationApiResponse) {
    this.config = response;
  }

  getAgentName() {
    return this.config.agent_name;
  }

  getOrgName() {
    return this.config.org_name;
  }

  getAgentEnabledValue() {
    return this.config.is_enabled;
  }

  getLogoUrl() {
    return this.config.logo;
  }

  getCoverImageUrl() {
    return this.config.cover_image;
  }

  getDefaultErrorMessage() {
    return this.config.body.default_error_message;
  }

  getDefaultArtifactUrl() {
    return this.config.body.welcome_message.default_artifact_url;
  }

  getInitialSuggestedQuestions() {
    return this.config.body.welcome_message.suggested_questions;
  }

  getStyleConfig() {
    const { style_config } = this.config;
    const result = { ...style_config };
    if (result.orb_config) {
      delete result.orb_config;
    }
    return result;
  }

  applyInvertTextColor() {
    return this.config.style_config.invert_text_color;
  }

  getOrbConfig() {
    return this.config.style_config.orb_config;
  }

  getBottomBarConfig() {
    return this.config.body.bottom_bar_config;
  }

  getCTAConfig() {
    return this.config.body.cta_config;
  }

  getConfig() {
    return this.config;
  }
}
