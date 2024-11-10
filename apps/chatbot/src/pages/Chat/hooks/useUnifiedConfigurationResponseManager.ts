import UnifiedSessionConfigResponseManager from "@meaku/core/managers/UnifiedSessionConfigResponseManager";
import useUnifiedConfigurationResponse from "./useUnifiedConfigurationResponse";

function useUnifiedConfigurationResponseManager() {
    const response = useUnifiedConfigurationResponse();

    return new UnifiedSessionConfigResponseManager(response);
}

export default useUnifiedConfigurationResponseManager;
