import { ConfigurationApiResponse } from '../types/api/configuration_response';

export class ConfigurationApiResponseManager {
  protected config: ConfigurationApiResponse;

  constructor(config: ConfigurationApiResponse) {
    this.config = config;
  }

  getAgentName() {
    return this.config.agent_name;
  }

  getOrgName() {
    return this.config.org_name;
  }

  getLogoUrl() {
    return this.config.logo;
  }

  getDefaultErrorMessage() {
    return this.config.body.default_error_message;
  }

  getInitialSuggestedQuestions() {
    return this.config.body.welcome_message.suggested_questions;
  }

  getStyleConfig() {
    return this.config.style_config;
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
