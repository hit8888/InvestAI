import { useContextSelector } from 'use-context-selector';
import { ApiProviderContext } from '../contexts/Context';

function useConfigurationApiResponse() {
  return useContextSelector(ApiProviderContext, (state) => state.configurationApiResponse);
}

export default useConfigurationApiResponse;
