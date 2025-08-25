export const getLastGroupMinHeight = (
  isLastGroup: boolean,
  containerHeight: number,
  hasActiveAdminSession: boolean,
): string | undefined => {
  if (!isLastGroup || containerHeight === 0) return undefined;

  // Reduce height by 80px for active admin session in last group
  const adjustedHeight = hasActiveAdminSession ? containerHeight * 0.4 : containerHeight;
  return `${adjustedHeight}px`;
};
