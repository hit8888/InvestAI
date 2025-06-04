import React, { createContext, useContext, useState } from 'react';

interface DataSourcesDrawerContextProps {
  isDataSourcesDrawerOpen: boolean;
  toggleDataSourcesDrawer: (value: boolean) => void;
}

const DataSourcesDrawerContext = createContext<DataSourcesDrawerContextProps | undefined>(undefined);

export const DataSourcesDrawerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDataSourcesDrawerOpen, setIsDataSourcesDrawerOpen] = useState(false);

  const toggleDataSourcesDrawer = (value: boolean) => {
    setIsDataSourcesDrawerOpen(value);
  };

  return (
    <DataSourcesDrawerContext value={{ isDataSourcesDrawerOpen, toggleDataSourcesDrawer }}>
      {children}
    </DataSourcesDrawerContext>
  );
};

export const useDataSourcesDrawer = (): DataSourcesDrawerContextProps => {
  const context = useContext(DataSourcesDrawerContext);
  if (!context) {
    throw new Error('useDataSourcesDrawer must be used within a DataSourcesDrawerProvider');
  }
  return context;
};
