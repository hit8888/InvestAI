import { useState, useEffect, useCallback } from 'react';

/**
 * Hook return value
 */
interface UseColumnPreferencesReturn {
  visibleColumns: string[];
  setColumnVisibility: (columnId: string, visible: boolean) => void;
  setColumnOrder: (columnIds: string[]) => void;
  resetColumnVisibility: () => void;
  toggleColumnVisibility: (columnId: string) => void;
  resetVersion: number;
}

/**
 * Hook for managing column visibility preferences
 * Persists to localStorage per page
 */
export const useColumnPreferences = (pageKey: string, defaultVisibleColumns: string[]): UseColumnPreferencesReturn => {
  const storageKey = `table-columns-${pageKey}`;

  // Reset version counter - increments only on manual reset to force table remount
  const [resetVersion, setResetVersion] = useState(0);

  // Load visible columns from localStorage or use defaults
  const [visibleColumns, setVisibleColumns] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored) as string[];
        // Validate that stored columns are still valid
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (error) {
      console.error('[useColumnPreferences] Error loading preferences:', error);
    }
    return defaultVisibleColumns;
  });

  // Update visible columns when defaults change (e.g., columns loaded from API)
  useEffect(() => {
    if (defaultVisibleColumns.length > 0 && visibleColumns.length === 0) {
      setVisibleColumns(defaultVisibleColumns);
    }
  }, [defaultVisibleColumns, visibleColumns.length, setVisibleColumns]);

  // Save visible columns to localStorage whenever visibility changes
  useEffect(() => {
    if (visibleColumns.length > 0) {
      try {
        localStorage.setItem(storageKey, JSON.stringify(visibleColumns));
      } catch (error) {
        console.error('[useColumnPreferences] Error saving preferences:', error);
      }
    }
  }, [visibleColumns, storageKey]);

  // Set visibility for a single column
  const setColumnVisibility = useCallback((columnId: string, visible: boolean) => {
    setVisibleColumns((prev) => {
      if (visible) {
        // Add if not already visible
        return prev.includes(columnId) ? prev : [...prev, columnId];
      } else {
        // Remove if visible
        return prev.filter((id) => id !== columnId);
      }
    });
  }, []);

  // Toggle visibility
  const toggleColumnVisibility = useCallback((columnId: string) => {
    setVisibleColumns((prev) => {
      if (prev.includes(columnId)) {
        return prev.filter((id) => id !== columnId);
      } else {
        return [...prev, columnId];
      }
    });
  }, []);

  // Set column order (reorder visible columns)
  const setColumnOrder = useCallback((columnIds: string[]) => {
    setVisibleColumns(columnIds);
  }, []);

  // Reset to defaults
  const resetColumnVisibility = useCallback(() => {
    setVisibleColumns(defaultVisibleColumns);
    // Increment version to force table remount and clear any animation state
    setResetVersion((v) => v + 1);
  }, [defaultVisibleColumns]);

  return {
    visibleColumns,
    setColumnVisibility,
    setColumnOrder,
    resetColumnVisibility,
    toggleColumnVisibility,
    resetVersion,
  };
};
