import { createContext, useContext, ReactNode, useState, useCallback, useMemo } from 'react';
import { CommandBarModuleConfigType, CommandBarModuleType } from '@meaku/core/types/api/configuration_response';

interface FeatureContextType {
  activeFeature: CommandBarModuleConfigType | null;
  setActiveFeature: (module: CommandBarModuleType | null) => void;
}

const FeatureContext = createContext<FeatureContextType | null>(null);

interface FeatureProviderProps {
  children: ReactNode;
  features: CommandBarModuleConfigType[];
}

export const DEFAULT_ASK_AI_MODULE_ID = 1;

const FeatureProvider = ({ features, children }: FeatureProviderProps) => {
  const [activeFeatureType, setActiveFeatureType] = useState<CommandBarModuleType | null>(null);

  const activeFeature = useMemo(
    () => features?.find((m) => m.module_type === activeFeatureType) ?? null,
    [features, activeFeatureType],
  );

  const handleSetActiveModule = useCallback((moduleType: CommandBarModuleType | null) => {
    if (!moduleType) {
      setActiveFeatureType(null);
      return;
    }

    setActiveFeatureType(moduleType);
  }, []);

  return (
    <FeatureContext.Provider
      value={{
        activeFeature,
        setActiveFeature: handleSetActiveModule,
      }}
    >
      {children}
    </FeatureContext.Provider>
  );
};

export const useFeature = () => {
  const context = useContext(FeatureContext);

  if (!context) {
    throw new Error('useFeature must be used within FeatureProvider');
  }

  return context;
};

export default FeatureProvider;
