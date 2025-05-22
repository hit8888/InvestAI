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
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    if (path === AGENT_DATA_SOURCES) {
      setSelectedType(null);
    } else if (path.includes(AGENT_DATA_SOURCES)) {
      const type = path.split(`${AGENT_DATA_SOURCES}/`)[1];
      if (type) {
        setSelectedType(type);
      }
    }
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
