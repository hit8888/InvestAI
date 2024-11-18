import { FC } from 'react';
import { ApiProviderContext } from './Context';
import { IAllApiResponsesWithQuery } from './types';
import { BaseApiProvider, IChildrenWithApiResponse } from '../../../shared/BaseApiProvider';
import { useSetClientStoreAndLocalStorageUsingConfigSessionData } from '../hooks/useSetClientStoreAndLocalStorageUsingConfigSessionData';

export const ApiProvider: FC<IChildrenWithApiResponse<IAllApiResponsesWithQuery>> = (props) => {
  useSetClientStoreAndLocalStorageUsingConfigSessionData(props.unifiedConfigurationResponse); //update local storage with sessionId and ProspectId

  return <BaseApiProvider ApiContext={ApiProviderContext} {...props} />;
};
