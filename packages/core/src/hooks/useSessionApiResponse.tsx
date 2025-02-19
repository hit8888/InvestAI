import { useContextSelector } from 'use-context-selector';
import { ApiProviderContext } from '../contexts/Context';

function useSessionApiResponse() {
  return useContextSelector(ApiProviderContext, (state) => state.sessionApiResponse);
}

export default useSessionApiResponse;
