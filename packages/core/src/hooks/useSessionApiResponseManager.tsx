import { SessionApiResponseManager } from '../managers/SessionApiResponseManager';
import useSessionApiResponse from './useSessionApiResponse';

function useSessionApiResponseManager() {
  const response = useSessionApiResponse();

  return response ? new SessionApiResponseManager(response) : null;
}

export default useSessionApiResponseManager;
