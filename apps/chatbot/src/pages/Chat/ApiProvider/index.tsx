import { FC } from 'react';
import { ApiProviderContext } from './Context';
import { IAllApiResponses } from './types';
import { BaseApiProvider, IChildrenWithApiResponse } from '../../../shared/BaseApiProvider';

export const ApiProvider: FC<IChildrenWithApiResponse<IAllApiResponses>> = (props) => {
  return <BaseApiProvider ApiContext={ApiProviderContext} {...props} />;
};
