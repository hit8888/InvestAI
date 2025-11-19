import { createContext, useContext, ReactNode, useState, useCallback, useMemo, useEffect } from 'react';
import {
  CommandBarModuleConfigType,
  CommandBarModuleType,
  CommandBarModuleTypeSchema,
} from '@meaku/core/types/api/configuration_response';
import { useCommandBarStore } from '../stores';

interface FeatureContextType {
  activeFeature: CommandBarModuleConfigType | null;
  setActiveFeature: (module: CommandBarModuleType | null) => void;
}

const FeatureContext = createContext<FeatureContextType | null>(null);

interface FeatureProviderProps {
  children: ReactNode;
}

export const DEFAULT_ASK_AI_MODULE_ID = 1;

const FeatureProvider = ({ children }: FeatureProviderProps) => {
  const { config, settings, updateSettings } = useCommandBarStore();

  const [activeFeatureType, setActiveFeatureType] = useState<CommandBarModuleType | null>(() => {
    const parsed = CommandBarModuleTypeSchema.safeParse(settings.active_module);

    if (!parsed.success) {
      return null;
    }

    return config.command_bar?.modules?.find((m) => m.module_type === parsed.data)?.module_type ?? null;
  });

  const activeFeature = useMemo(
    () => config.command_bar?.modules?.find((m) => m.module_type === activeFeatureType) ?? null,
    [config.command_bar?.modules, activeFeatureType],
  );

  const handleSetActiveModule = useCallback((moduleType: CommandBarModuleType | null) => {
    if (!moduleType) {
      setActiveFeatureType(null);
      return;
    }

    setActiveFeatureType(moduleType);
  }, []);

  useEffect(() => {
    if (!settings.active_module) {
      return;
    }

    setActiveFeatureType((existingFeatureType) => {
      const parsed = CommandBarModuleTypeSchema.safeParse(settings.active_module);

      if (existingFeatureType || !parsed.success) {
        return existingFeatureType;
      }

      return parsed.data;
    });
    updateSettings({ active_module: null });
  }, [settings.active_module, updateSettings]);

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
