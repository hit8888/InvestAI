import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { AppRoutesEnum } from '../utils/constants';

interface SidebarContextProps {
  selectedType: string | null;
  toggleDataSourceSelectedType: (value: string | null) => void;
  isUploading: boolean;
  toggleIsUploadingValue: (value: boolean) => void;
}

const { AGENT_DATA_SOURCES } = AppRoutesEnum;

const DataSourcesContext = createContext<SidebarContextProps | undefined>(undefined);

export const DataSourcesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const getSelectedTypeFromPath = (path: string): string | null => {
    // Remove trailing slash for consistent comparison
    const normalizedPath = path.replace(/\/+$/, '');
    const normalizedDataSourcesPath = AGENT_DATA_SOURCES.replace(/\/+$/, '');

    if (normalizedPath === normalizedDataSourcesPath) {
      return null;
    } else if (normalizedPath.includes(normalizedDataSourcesPath)) {
      const type = normalizedPath.split(`${normalizedDataSourcesPath}/`)[1];
      return type || null;
    }
    return null;
  };

  const [selectedType, setSelectedType] = useState<string | null>(() => getSelectedTypeFromPath(location.pathname));
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    setSelectedType(getSelectedTypeFromPath(location.pathname));
  }, [location.pathname]);

  const toggleDataSourceSelectedType = (value: string | null) => {
    setSelectedType(value);
  };

  const toggleIsUploadingValue = (value: boolean) => {
    setIsUploading(value);
  };

  return (
    <DataSourcesContext.Provider
      value={{ selectedType, toggleDataSourceSelectedType, isUploading, toggleIsUploadingValue }}
    >
      {children}
    </DataSourcesContext.Provider>
  );
};

export const useDataSources = (): SidebarContextProps => {
  const context = useContext(DataSourcesContext);
  if (!context) {
    throw new Error('useDataSources must be used within a DataSourcesProvider');
  }
  return context;
};
