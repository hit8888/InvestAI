import { createContext } from 'use-context-selector';
import type { IAllApiResponsesWithQuery } from './types';

export const ApiProviderContext = createContext({} as IAllApiResponsesWithQuery);
