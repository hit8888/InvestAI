import { FC } from 'react';
import { ApiProviderContext } from './Context';
import { IAllApiResponsesWithQuery } from './types';
import { BaseApiProvider, IChildrenWithApiResponse } from '../../../shared/BaseApiProvider';
import { useSetLocalStorageUsingConfigSessionData } from '../hooks/useSetLocalStorageUsingConfigSessionData';

export const ApiProvider: FC<IChildrenWithApiResponse<IAllApiResponsesWithQuery>> = (props) => {
  useSetLocalStorageUsingConfigSessionData(props.unifiedConfigurationResponse); //update local storage with sessionId and ProspectId

  return <BaseApiProvider ApiContext={ApiProviderContext} {...props} />;
};
