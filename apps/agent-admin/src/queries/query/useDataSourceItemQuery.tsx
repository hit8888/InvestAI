import { z } from 'zod';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { getDataSourceWebpagesItemData, getDataSourceDocumentsItemData } from '@neuraltrade/core/adminHttp/api';
import { AxiosResponse } from 'axios';
import { BreakoutQueryOptions } from '@neuraltrade/core/types/queries';
import { DOCUMENTS_PAGE, WEBPAGES_PAGE } from '@neuraltrade/core/utils/index';
import { DataSourceWebpagesResponseResultSchema } from '@neuraltrade/core/types/admin/api';
import { useSessionStore } from '../../stores/useSessionStore';

const getDataSourceItemKey = (tenantName: string, tableKey: string, dataSourceID: number): unknown[] => [
  'data-source-item',
  tenantName,
  tableKey,
  dataSourceID,
];

type DataSourceItemResponse = z.infer<typeof DataSourceWebpagesResponseResultSchema>;

type DataSourceTableItemKey = ReturnType<typeof getDataSourceItemKey>;

interface IProps {
  tableKey: string;
  queryOptions: BreakoutQueryOptions<DataSourceItemResponse, DataSourceTableItemKey>;
  dataSourceID: number;
}

const API_FUNCTION_CALL_MAPPING = {
  [WEBPAGES_PAGE]: getDataSourceWebpagesItemData,
  [DOCUMENTS_PAGE]: getDataSourceDocumentsItemData,
};

const useDataSourceItemQuery = ({
  queryOptions,
  tableKey,
  dataSourceID,
}: IProps): UseQueryResult<DataSourceItemResponse> => {
  const tenantName = useSessionStore((state) => state.activeTenant?.['tenant-name']);
  const dataSourceQuery = useQuery({
    queryKey: getDataSourceItemKey(tenantName ?? '', tableKey, dataSourceID),
    queryFn: async (): Promise<DataSourceItemResponse> => {
      if (!tenantName) throw new Error('Tenant name is undefined');
      const response: AxiosResponse<DataSourceItemResponse> =
        await API_FUNCTION_CALL_MAPPING[tableKey as keyof typeof API_FUNCTION_CALL_MAPPING](dataSourceID);
      return response.data;
    },
    ...queryOptions,
    refetchOnMount: 'always',
  });

  return dataSourceQuery;
};

export default useDataSourceItemQuery;
