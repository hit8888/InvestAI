export function debounce<T extends (...args: unknown[]) => void>(
  func: T,
  wait: number,
) {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
