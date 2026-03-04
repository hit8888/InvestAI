import { useState, useEffect, useMemo } from 'react';
import { CommandBarModuleConfigType } from '@neuraltrade/core/types/api/configuration_response';
import { CommandBarModuleTypeSchema } from '@neuraltrade/core/types/api/configuration_response';

const { ASK_AI } = CommandBarModuleTypeSchema.enum;

/**
 * Custom hook for managing BottomCenterBar module state and filtering
 */
export const useBottomBarModules = (
  modules: CommandBarModuleConfigType[],
  isConfigLoading: boolean,
  isMobile: boolean,
) => {
  const [isModulesReady, setIsModulesReady] = useState(false);

  // Track when modules become available
  useEffect(() => {
    if (!isConfigLoading && modules.length > 0) {
      setIsModulesReady(true);
    }
  }, [isConfigLoading, modules.length]);

  // Filter available modules based on device type
  const availableModules = useMemo(
    () => modules.filter((module) => (isMobile ? module.module_type === ASK_AI : true)),
    [modules, isMobile],
  );

  // Separate Ask AI from other modules
  const { askAiModule, otherModules } = useMemo(
    () => ({
      askAiModule: availableModules.find((module) => module.module_type === ASK_AI),
      otherModules: availableModules.filter((module) => module.module_type !== ASK_AI),
    }),
    [availableModules],
  );

  return {
    isModulesReady,
    availableModules,
    askAiModule,
    otherModules,
  };
};
