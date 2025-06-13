import { DataSourcePayload } from '@meaku/core/types/admin/api';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import {
  getDataSourceDocumentsData,
  getDataSourceArtifactsData,
  getDataSourceWebpagesData,
} from '@meaku/core/adminHttp/api';
import { AxiosResponse } from 'axios';
import { CommonDataSourceTableResponse } from '@meaku/core/types/admin/admin';
import { BreakoutQueryOptions } from '@meaku/core/types/queries';
import { getTenantFromLocalStorage, SLIDES_PAGE } from '@meaku/core/utils/index';
import { DOCUMENTS_PAGE, VIDEOS_PAGE, WEBPAGES_PAGE } from '@meaku/core/utils/index';

const getDataSourceTableKey = (payload: DataSourcePayload, tenantName: string, tableKey: string): unknown[] => [
  'data-source-table',
  JSON.stringify(payload),
  tenantName,
  tableKey,
];

type DataSourceTableResponse = CommonDataSourceTableResponse;

type DataSourceTableDataKey = ReturnType<typeof getDataSourceTableKey>;

interface IProps {
  payload: DataSourcePayload;
  tableKey: string;
  queryOptions: BreakoutQueryOptions<DataSourceTableResponse, DataSourceTableDataKey>;
}

const API_FUNCTION_CALL_MAPPING = {
  [WEBPAGES_PAGE]: getDataSourceWebpagesData,
  [DOCUMENTS_PAGE]: getDataSourceDocumentsData,
  [VIDEOS_PAGE]: getDataSourceArtifactsData,
  [SLIDES_PAGE]: getDataSourceArtifactsData,
};

const useDataSourceTableViewQuery = ({
  payload,
  queryOptions,
  tableKey,
}: IProps): UseQueryResult<DataSourceTableResponse> => {
  const tenantName = getTenantFromLocalStorage();
  const dataSourceQuery = useQuery({
    queryKey: getDataSourceTableKey(payload, tenantName ?? '', tableKey),
    queryFn: async (): Promise<DataSourceTableResponse> => {
      if (!tenantName) throw new Error('Tenant name is undefined');
      const response: AxiosResponse<DataSourceTableResponse> =
        await API_FUNCTION_CALL_MAPPING[tableKey as keyof typeof API_FUNCTION_CALL_MAPPING](payload);
      return response.data;
    },
    ...queryOptions,
    refetchOnMount: 'always',
  });

  return dataSourceQuery;
};

export default useDataSourceTableViewQuery;
