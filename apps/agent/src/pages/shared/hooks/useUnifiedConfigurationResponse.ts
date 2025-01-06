import { useContextSelector } from 'use-context-selector';
import { ApiProviderContext } from '../ApiProvider/Context';

function useUnifiedConfigurationResponse() {
  return useContextSelector(ApiProviderContext, (state) => state.unifiedConfigurationResponse);
}

export default useUnifiedConfigurationResponse;
