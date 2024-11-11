// withWhiteLabelConfig.tsx
import React, { useEffect, useState } from "react";
import useUnifiedConfigurationResponseManager from "../pages/Chat/hooks/useUnifiedConfigurationResponseManager";
import { handleColorConfig } from "./common";


/** 
* Usage example:
* const MyComponent = () => <div>My Component</div>;
* export default withWhiteLabelConfig(MyComponent);
*/

export const withWhiteLabelConfig = (WrappedComponent: React.ComponentType) => {
    return function WithWhiteLabelConfigComponent() {
        const [isConfigApplied, setIsConfigApplied] = useState(false);
        const unifiedConfigurationResponseManager = useUnifiedConfigurationResponseManager();

        useEffect(() => {
            const applyConfig = () => {
                const styleConfig = unifiedConfigurationResponseManager.getStyleConfig();
                handleColorConfig(styleConfig);
                setIsConfigApplied(true);
            };

            applyConfig();
        }, [unifiedConfigurationResponseManager]);

        if (!isConfigApplied) {
            return null; // Or a loading component
        }

        return <WrappedComponent />;
    };
};