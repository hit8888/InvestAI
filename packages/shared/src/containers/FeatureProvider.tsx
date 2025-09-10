import { createContext, useContext, ReactNode, useState } from 'react';
import { CommandBarModuleConfigType, CommandBarModuleType } from '@meaku/core/types/api/configuration_response';

const DEFAULT_ASK_AI_MODULE_ID = 1;
interface FeatureContextType {
  activeFeature: CommandBarModuleType | undefined;
  activeModule: CommandBarModuleConfigType | null;
  setActiveModule: React.Dispatch<React.SetStateAction<CommandBarModuleConfigType | null>>;
  activeFeatureModuleId: number;
}

const FeatureContext = createContext<FeatureContextType | null>(null);

interface FeatureProviderProps {
  children: ReactNode;
}

const FeatureProvider = ({ children }: FeatureProviderProps) => {
  const [activeModule, setActiveModule] = useState<CommandBarModuleConfigType | null>(null);

  return (
    <FeatureContext.Provider
      value={{
        activeFeature: activeModule?.module_type,
        activeModule,
        setActiveModule,
        activeFeatureModuleId: activeModule?.id ?? DEFAULT_ASK_AI_MODULE_ID,
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
