import { FC } from 'react';
import { ApiProviderContext } from '@meaku/core/contexts/Context';
import { BaseApiProvider, IChildrenWithApiResponse } from '../../../shared/BaseApiProvider';
import { useSetClientStoreAndLocalStorageUsingConfigSessionData } from '../hooks/useSetClientStoreAndLocalStorageUsingConfigSessionData';
import { IAllApiResponsesWithQuery } from '@meaku/core/types/types';

export const ApiProvider: FC<IChildrenWithApiResponse<IAllApiResponsesWithQuery>> = (props) => {
  useSetClientStoreAndLocalStorageUsingConfigSessionData({
    configurationApiResponse: props.configurationApiResponse,
    sessionApiResponse: props.sessionApiResponse,
  }); //update local storage with sessionId and ProspectId

  return <BaseApiProvider ApiContext={ApiProviderContext} {...props} />;
};
