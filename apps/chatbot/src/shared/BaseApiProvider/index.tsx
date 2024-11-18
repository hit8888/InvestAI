import { useMemo } from 'react';
import { Context } from 'use-context-selector';

import ChildrenAggressiveMemo from '../ChildrenAggressiveMemo';

export type IChildrenWithApiResponse<TApiResponses> = {
    children?: React.ReactNode;
} & TApiResponses;

export type IBaseApiProviderProps<TApiResponses> = {
    ApiContext: Context<TApiResponses>;
} & IChildrenWithApiResponse<TApiResponses>;

export function BaseApiProvider<TApiResponses>({
    children,
    ApiContext,
    ...responses
}: IBaseApiProviderProps<TApiResponses>) {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const values = useMemo(() => responses, [...Object.values(responses)]) as TApiResponses;

    return (
        <ApiContext.Provider value={values}>
            <ChildrenAggressiveMemo>{children}</ChildrenAggressiveMemo>
        </ApiContext.Provider>
    );
}
