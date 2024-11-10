
import UnifiedSessionConfigResponseManager from '@meaku/core/managers/UnifiedSessionConfigResponseManager';
import useUnifiedConfigurationResponse from './useUnifiedConfigurationResponseManager';

function useUnifiedConfigurationResponseManager() {
  const airSeatMapResponse = useUnifiedConfigurationResponse();

  return new UnifiedSessionConfigResponseManager(airSeatMapResponse);
}

export default useUnifiedConfigurationResponseManager;
