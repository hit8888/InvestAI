import { createContext } from 'use-context-selector';
import type { IAllApiResponses } from './types';

export const ApiProviderContext = createContext({} as IAllApiResponses);
