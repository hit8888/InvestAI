import { CommandBarModuleTypeSchema } from '@meaku/core/types/api/configuration_response';

const { ASK_AI } = CommandBarModuleTypeSchema.enum;

/**
 * Calculate the visual index for animation sequencing
 * Ask AI always gets the last position (highest index)
 */
export const getVisualIndex = (currentIndex: number, moduleType: string, totalActions: number): number => {
  const isAskAI = moduleType === ASK_AI;
  return isAskAI ? totalActions - 1 : currentIndex;
};

/**
 * Calculate animation delay based on visual index
 */
export const getAnimationDelay = (visualIndex: number, baseDelay: number, staggerInterval: number): number => {
  return baseDelay + visualIndex * staggerInterval;
};

/**
 * Calculate tooltip delay based on visual index
 */
export const getTooltipDelay = (visualIndex: number, baseDelay: number, staggerInterval: number): number => {
  return Math.round((baseDelay + visualIndex * staggerInterval) * 1000);
};
