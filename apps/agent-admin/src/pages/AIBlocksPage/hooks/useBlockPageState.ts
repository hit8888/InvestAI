import { useState, useEffect, useCallback, useRef } from 'react';
import { Block, UpdateBlockPayload, VisibilityCondition } from '@meaku/core/types/admin/api';
import { useUpdateBlockMutation } from '../../../queries/mutation/useUpdateBlockMutation';
import { getTenantActiveAgentId } from '@meaku/core/utils/index';
import { toast } from 'react-hot-toast';
import { BlockVisibilityData } from '../components/BlockVisibilityContent';
import { PageVisibilityItem } from '../components/PageLevelVisibility';

/* eslint-disable */
export interface UseBlockPageStateOptions<TModuleConfig = Record<string, any>> {
  /** The block data from the API */
  block: Block;
  /** Initial module-specific config (optional, will use block.module_specific_config if not provided) */
  initialModuleConfig?: TModuleConfig;
  /** Transform function to convert block.module_specific_config to your typed config */
  parseModuleConfig?: (config: Record<string, any> | undefined) => TModuleConfig;
  /** Auto-save delay in milliseconds (default: 1000ms) */
  autoSaveDelay?: number;
  /** Show success toast on save (default: true) */
  showSuccessToast?: boolean;
  /** Show error toast on error (default: true) */
  showErrorToast?: boolean;
}

export interface UseBlockPageStateReturn<TModuleConfig = Record<string, any>> {
  // State
  blockVisibilityData: BlockVisibilityData;
  moduleConfig: TModuleConfig;
  pageVisibilityRules: PageVisibilityItem[];
  hasUnsavedChanges: boolean;

  // Handlers
  handleBlockVisibilityChange: (data: BlockVisibilityData) => void;
  handleModuleConfigChange: (data: TModuleConfig | ((prev: TModuleConfig) => TModuleConfig)) => void;
  handlePageVisibilityChange: (data: PageVisibilityItem[]) => void;
  handleSave: (overrides?: {
    pageVisibilityRules?: PageVisibilityItem[];
    blockVisibilityData?: BlockVisibilityData;
    moduleConfig?: TModuleConfig;
  }) => Promise<void>;

  // Mutation state
  isLoading: boolean;
  isUpdating: boolean;

  // Agent ID
  agentId: number | null;

  // Api response
  block: Block;
}

/**
 * Generic hook for managing block page state and API integration
 *
 * This hook centralizes all the common logic for block pages:
 * - Block visibility management (is_active, name, icon_asset)
 * - Module-specific config management (generic typed)
 * - Page-level visibility rules management
 * - Debounced auto-save
 * - Manual save with partial updates
 * - Sync with block prop changes
 *
 * @example
 * ```tsx
 * interface MyModuleConfig {
 *   avatar: string;
 *   name: string;
 * }
 *
 * const {
 *   blockVisibilityData,
 *   moduleConfig,
 *   handleBlockVisibilityChange,
 *   handleModuleConfigChange,
 *   isLoading,
 * } = useBlockPageState<MyModuleConfig>({
 *   block,
 *   parseModuleConfig: (config) => ({
 *     avatar: config?.avatar || '',
 *     name: config?.name || '',
 *   }),
 * });
 * ```
 */
export function useBlockPageState<TModuleConfig = Record<string, any>>({
  block,
  initialModuleConfig,
  parseModuleConfig,
  showSuccessToast = true,
  showErrorToast = true,
}: UseBlockPageStateOptions<TModuleConfig>): UseBlockPageStateReturn<TModuleConfig> {
  const agentId = getTenantActiveAgentId();
  const updateBlockMutation = useUpdateBlockMutation();

  // Store parseModuleConfig in a ref to avoid re-running effects when it changes
  // (it's typically created inline, so it would be a new reference on every render)
  const parseModuleConfigRef = useRef(parseModuleConfig);
  useEffect(() => {
    parseModuleConfigRef.current = parseModuleConfig;
  }, [parseModuleConfig]);

  // ============ State Management ============
  // Block visibility data (is_active, name, icon_asset)
  const [blockVisibilityData, setBlockVisibilityData] = useState<BlockVisibilityData>({
    isVisible: block.is_active,
    title: block?.tooltip || '',
    description: block.description || '',
    iconUrl: block.icon_asset?.public_url || undefined,
  });

  // Module-specific config (generic typed)
  const [moduleConfig, setModuleConfig] = useState<TModuleConfig>(() => {
    if (initialModuleConfig !== undefined) {
      return initialModuleConfig;
    }
    if (parseModuleConfig) {
      return parseModuleConfig(block.module_specific_config);
    }
    return (block.module_specific_config || {}) as TModuleConfig;
  });

  // Page-level visibility rules (stored in visibility_conditions)
  const [pageVisibilityRules, setPageVisibilityRules] = useState<PageVisibilityItem[]>(() => {
    if (!block.visibility_conditions || block.visibility_conditions.length === 0) {
      return [];
    }
    return block.visibility_conditions.map((condition) => ({
      visibility_rules: condition.operator || '',
      page_url: condition.value || '',
    }));
  });

  // Track if there are unsaved changes
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // ============ Sync State with Block Prop ============
  useEffect(() => {
    setBlockVisibilityData({
      isVisible: block.is_active,
      title: block.tooltip || '',
      description: block.description || '',
      iconUrl: block.icon_asset?.public_url || undefined,
    });

    // Use the ref to get the latest parseModuleConfig without triggering re-renders
    const currentParseModuleConfig = parseModuleConfigRef.current;
    if (currentParseModuleConfig) {
      setModuleConfig(currentParseModuleConfig(block.module_specific_config));
    } else if (initialModuleConfig === undefined) {
      setModuleConfig((block.module_specific_config || {}) as TModuleConfig);
    }

    if (!block.visibility_conditions || block.visibility_conditions.length === 0) {
      setPageVisibilityRules([]);
    } else {
      setPageVisibilityRules(
        block.visibility_conditions.map((condition) => ({
          visibility_rules: condition.operator || '',
          page_url: condition.value || '',
        })),
      );
    }
    // Note: parseModuleConfig is intentionally NOT in the dependency array to avoid infinite loops
    // We use parseModuleConfigRef to get the latest version when block changes
  }, [block, initialModuleConfig]);

  // ============ API Update Function ============
  const updateBlock = useCallback(
    async (payload: UpdateBlockPayload) => {
      if (!agentId) {
        if (showErrorToast) {
          toast.error('Agent ID not found');
        }
        throw new Error('Agent ID not found');
      }

      try {
        await updateBlockMutation.mutateAsync({
          agentId,
          blockId: block.id,
          payload,
        });
        setHasUnsavedChanges(false);
        if (showSuccessToast) {
          toast.success('Block updated successfully');
        }
      } catch (error: any) {
        console.error('Error updating block:', error);

        // Extract error message from API response
        let errorMessage = 'Failed to update block';
        if (error?.response?.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error?.response?.data?.error) {
          errorMessage = error.response.data.error;
        } else if (error?.message) {
          errorMessage = error.message;
        }

        if (showErrorToast) {
          toast.error(errorMessage);
        }

        // Re-throw the error so the caller can handle it
        throw error;
      }
    },
    [agentId, block.id, updateBlockMutation, showSuccessToast, showErrorToast],
  );

  // ============ Build Update Payload (Partial Updates) ============
  const buildUpdatePayload = useCallback(
    (
      partial: boolean = false,
      overrides?: {
        pageVisibilityRules?: PageVisibilityItem[];
        blockVisibilityData?: BlockVisibilityData;
        moduleConfig?: TModuleConfig;
      },
    ): UpdateBlockPayload => {
      // Use overrides if provided, otherwise use current state
      const currentBlockData = overrides?.blockVisibilityData || blockVisibilityData;
      const currentModuleConfig = overrides?.moduleConfig || moduleConfig;
      const currentPageRules = overrides?.pageVisibilityRules || pageVisibilityRules;

      if (!partial || !block) {
        // Full payload for initial load or when partial=false
        const payload: UpdateBlockPayload = {
          name: currentBlockData.title,
          is_active: currentBlockData.isVisible,
          description: currentBlockData.description,
          icon_asset_id: currentBlockData.iconUrl || null,
          module_specific_config: currentModuleConfig as Record<string, any>,
        };

        // Only include visibility_conditions if there are valid rules
        const validRules = currentPageRules.filter(
          (rule) => rule.visibility_rules.trim() !== '' && rule.page_url.trim() !== '',
        );
        if (validRules.length > 0) {
          payload.visibility_conditions = validRules.map(
            (rule): VisibilityCondition => ({
              operator: rule.visibility_rules,
              value: rule.page_url,
            }),
          );
        }

        return payload;
      }

      // Partial payload - only send changed fields
      const payload: Partial<UpdateBlockPayload> = {};

      // Check each field for changes
      if (currentBlockData.title !== block.tooltip) {
        payload.tooltip = currentBlockData.title;
      }

      if (currentBlockData.description !== block.description) {
        payload.description = currentBlockData.description;
      }

      if (currentBlockData.isVisible !== block.is_active) {
        payload.is_active = currentBlockData.isVisible;
      }

      if (!!currentBlockData.iconUrl && currentBlockData.iconUrl !== (block.icon_asset?.public_url || undefined)) {
        payload.icon_asset_id = currentBlockData.iconUrl || null;
      }

      if (
        typeof currentModuleConfig === 'object' &&
        currentModuleConfig !== null &&
        'cover_image' in currentModuleConfig &&
        typeof currentModuleConfig.cover_image === 'string' &&
        currentModuleConfig.cover_image.length > 0 &&
        currentModuleConfig.cover_image !== (block.banner?.id || undefined)
      ) {
        payload.banner_id = currentModuleConfig.cover_image || null;
      }

      // Check module_specific_config changes
      const originalConfig = block.module_specific_config;
      if (JSON.stringify(currentModuleConfig) !== JSON.stringify(originalConfig)) {
        // Don't include module_specific_config if cover_image is present
        if (
          !(
            typeof currentModuleConfig === 'object' &&
            currentModuleConfig !== null &&
            'cover_image' in currentModuleConfig
          )
        ) {
          payload.module_specific_config = currentModuleConfig as Record<string, any>;
        }
      }

      // Check visibility_conditions changes
      const originalRules =
        block.visibility_conditions?.map((cond) => ({
          visibility_rules: cond.operator,
          page_url: cond.value,
        })) || [];

      if (JSON.stringify(currentPageRules) !== JSON.stringify(originalRules)) {
        const validRules = currentPageRules.filter(
          (rule) => rule.visibility_rules.trim() !== '' && rule.page_url.trim() !== '',
        );
        payload.visibility_conditions = validRules.map(
          (rule): VisibilityCondition => ({
            operator: rule.visibility_rules,
            value: rule.page_url,
          }),
        );
      }

      return payload as UpdateBlockPayload;
    },
    [blockVisibilityData, moduleConfig, pageVisibilityRules, block],
  );

  // ============ Save Handler (Manual Save - sends only changed fields) ============
  const handleSave = useCallback(
    async (overrides?: {
      pageVisibilityRules?: PageVisibilityItem[];
      blockVisibilityData?: BlockVisibilityData;
      moduleConfig?: TModuleConfig;
    }) => {
      // Build partial payload with only changed fields for PATCH request
      // Use overrides if provided (for handling fresh data from child components)
      const payload = buildUpdatePayload(true, overrides);

      // Only send update if there are actual changes
      if (Object.keys(payload).length > 0) {
        try {
          await updateBlock(payload);
          // Reset unsaved changes flag only after successful save
          setHasUnsavedChanges(false);
        } catch (error) {
          // Error is already handled in updateBlock (toast shown)
          // Re-throw to allow caller to handle if needed
          throw error;
        }
      }
    },
    [buildUpdatePayload, updateBlock],
  );

  // ============ Change Handlers ============
  const handleBlockVisibilityChange = useCallback((data: BlockVisibilityData) => {
    setBlockVisibilityData(data);
    setHasUnsavedChanges(true);
  }, []);

  const handleModuleConfigChange = useCallback((data: TModuleConfig | ((prev: TModuleConfig) => TModuleConfig)) => {
    if (typeof data === 'function') {
      setModuleConfig((prev) => {
        const newConfig = (data as (prev: TModuleConfig) => TModuleConfig)(prev);
        setHasUnsavedChanges(true);
        return newConfig;
      });
    } else {
      setModuleConfig(data);
      setHasUnsavedChanges(true);
    }
  }, []);

  const handlePageVisibilityChange = useCallback((data: PageVisibilityItem[]) => {
    setPageVisibilityRules(data);
    setHasUnsavedChanges(true);
  }, []);

  // ============ Return ============
  return {
    // State
    blockVisibilityData,
    moduleConfig,
    pageVisibilityRules,
    hasUnsavedChanges,

    // Handlers
    handleBlockVisibilityChange,
    handleModuleConfigChange,
    handlePageVisibilityChange,
    handleSave,

    // Mutation state
    isLoading: updateBlockMutation.isPending,
    isUpdating: updateBlockMutation.isPending,

    // Agent ID
    agentId,

    // Api response
    block,
  };
}
