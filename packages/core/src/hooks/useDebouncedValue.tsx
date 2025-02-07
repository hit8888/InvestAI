import { useState, useEffect } from "react";
import { debounce } from "lodash";

export function useDebouncedValue<T>(value: T, delay = 500): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = debounce((newValue) => setDebouncedValue(newValue), delay);
    handler(value);

    return () => handler.cancel(); // Cleanup debounce on unmount or value change
  }, [value, delay]);

  return debouncedValue;
}
