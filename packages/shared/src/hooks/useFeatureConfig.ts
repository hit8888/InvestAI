import { CommandBarModuleConfigType, CommandBarModuleType } from '@neuraltrade/core/types/api/configuration_response';
import { useCommandBarStore } from '../stores';

const useFeatureConfig = (activeFeature?: CommandBarModuleType): CommandBarModuleConfigType | undefined => {
  const { config } = useCommandBarStore();

  return config.command_bar?.modules.find((m) => m.module_type === activeFeature);
};

export default useFeatureConfig;
