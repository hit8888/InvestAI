import { useContextSelector } from 'use-context-selector';
import { ApiProviderContext } from '../contexts/Context';

function useUnifiedConfigurationResponse() {
  return useContextSelector(ApiProviderContext, (state) => state.unifiedConfigurationResponse);
}

export default useUnifiedConfigurationResponse;
