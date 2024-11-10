import { FC } from 'react';
import { ApiProviderContext } from './Context';
import { IAllApiResponsesWithQuery } from './types';
import { BaseApiProvider, IChildrenWithApiResponse } from '../../../shared/BaseApiProvider';

export const ApiProvider: FC<IChildrenWithApiResponse<IAllApiResponsesWithQuery>> = (props) => {
  return <BaseApiProvider ApiContext={ApiProviderContext} {...props} />;
};
