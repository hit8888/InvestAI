import { z } from 'zod';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { getDataSourceWebpagesItemData, getDataSourceDocumentsItemData } from '@meaku/core/adminHttp/api';
import { AxiosResponse } from 'axios';
import { BreakoutQueryOptions } from '@meaku/core/types/queries';
import { getTenantFromLocalStorage } from '@meaku/core/utils/index';
import { DOCUMENTS_PAGE, WEBPAGES_PAGE } from '@meaku/core/utils/index';
import { DataSourceWebpagesResponseResultSchema } from '@meaku/core/types/admin/api';

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
  const tenantName = getTenantFromLocalStorage();
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
