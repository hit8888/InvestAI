import { ConfigurationApiResponseManager } from '../managers/ConfigurationApiResponseManager';
import useConfigurationApiResponse from './useConfigurationApiResponse';

function useConfigurationApiResponseManager() {
  const response = useConfigurationApiResponse();

  return new ConfigurationApiResponseManager(response);
}

export default useConfigurationApiResponseManager;
