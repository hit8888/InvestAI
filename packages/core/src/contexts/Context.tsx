import { createContext } from 'use-context-selector';
import { IAllApiResponsesWithQuery } from '../types/types';

export const ApiProviderContext = createContext({} as IAllApiResponsesWithQuery);
