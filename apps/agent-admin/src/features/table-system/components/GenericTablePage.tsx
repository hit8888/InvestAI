import type { TablePageConfig } from '../types';
import { useGenericTableState } from '../hooks/useGenericTableState';
import { validateTableConfig } from '../utils/configValidator';
import { GenericTableContainer } from './GenericTableContainer';
import { GenericRowDrawer } from './GenericRowDrawer';
import { ConfigErrorScreen } from './states/ConfigErrorScreen';

interface GenericTablePageProps<TRow = unknown> {
  config: TablePageConfig<TRow>;
}

/**
 * Main entry point for generic table pages
 * Validates config, manages state, and renders table with drawer
 */
export const GenericTablePage = <TRow extends Record<string, unknown>>({ config }: GenericTablePageProps<TRow>) => {
  // Initialize table state first (hooks must be called unconditionally)
  const tableState = useGenericTableState<TRow>(config);

  // Validate configuration
  const validation = validateTableConfig(config as TablePageConfig);

  if (!validation.valid) {
    console.error('[GenericTablePage] Invalid configuration:', validation.error);
    return <ConfigErrorScreen error={validation.error!} />;
  }

  return (
    <div className="flex w-full">
      {/* Main table area */}
      <div className="w-full flex-1">
        <GenericTableContainer config={config} tableState={tableState} />
      </div>

      {/* Drawer for row details */}
      <GenericRowDrawer
        config={config}
        getRowById={tableState.getRowById}
        isTableLoading={tableState.isLoading}
        refetch={tableState.refetch}
        rowKeyColumn={tableState.rowKeyColumn}
      />
    </div>
  );
};
