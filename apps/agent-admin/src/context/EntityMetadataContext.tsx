import React, { createContext, useContext } from 'react';
import { useAuth } from './AuthProvider';
import useEntityMetadataQuery from '../queries/query/useEntityMetadataQuery';
import { transformEntityDataToColumnHeaderLabelMapping } from '../utils/common';

interface EntityMetadataContextType {
  transformedEntityMetadata: Record<string, Record<string, string> | string>;
  isLoading: boolean;
  error: Error | null;
}

type EntityMetadataProviderProps = {
  children: React.ReactNode;
  pageType: string;
};

const EntityMetadataContext = createContext<EntityMetadataContextType | undefined>(undefined);

export const EntityMetadataProvider: React.FC<EntityMetadataProviderProps> = ({ children, pageType }) => {
  const { isAuthenticated } = useAuth();
  const {
    data: entityMetadata,
    isLoading,
    error,
  } = useEntityMetadataQuery({
    entityType: pageType,
    queryOptions: {
      enabled: isAuthenticated,
    },
  });

  const transformedEntityMetadata = entityMetadata ? transformEntityDataToColumnHeaderLabelMapping(entityMetadata) : {};

  return (
    <EntityMetadataContext.Provider
      value={{
        transformedEntityMetadata,
        isLoading,
        error: error as Error | null,
      }}
    >
      {children}
    </EntityMetadataContext.Provider>
  );
};

export const useEntityMetadata = () => {
  const context = useContext(EntityMetadataContext);
  if (context === undefined) {
    throw new Error('useEntityMetadata must be used within an EntityMetadataProvider');
  }
  return context;
};
