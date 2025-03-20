import { trackError } from '../../../../apps/agent/src/utils/error';
import { ConfigurationApiResponse, ConfigurationSchema } from '../types/api/configuration_response';

export class ConfigurationApiResponseManager {
  protected config: ConfigurationApiResponse;

  constructor(response: ConfigurationApiResponse) {
    const validatedConfig = ConfigurationSchema.safeParse(response);
    if (!validatedConfig.success) {
      console.error('Invalid session response:', validatedConfig.error.errors);
      trackError(validatedConfig.error.errors, {
        component: 'ConfigurationApiResponseManager',
        action: 'constructor',
      });
      throw new Error(validatedConfig.error.errors.map((error) => error.message).join(', '));
    }
    this.config = validatedConfig.data;
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

  getShowBouncingEffectOnSuggestedQuestions() {
    return this.config.body.welcome_message.bounce_message;
  }

  getStyleConfig() {
    const { style_config } = this.config;
    const result = { ...style_config };
    if (result.orb_config) {
      delete result.orb_config;
    }
    return result;
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
