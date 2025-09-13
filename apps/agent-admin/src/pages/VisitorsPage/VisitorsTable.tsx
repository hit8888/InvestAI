import { useState } from 'react';
import VisitorsTableContainer from './components/VisitorsTableContainer';
import CompanyDetailsDrawer from './components/CompanyDetailsDrawer';
import type { CompanyData } from './components/CompanyDetailsDrawer/types';

const VisitorsTable = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedCompanyData, setSelectedCompanyData] = useState<CompanyData | undefined>(undefined);

  const handleCompanySelect = (companyData: CompanyData) => {
    setSelectedCompanyData(companyData);
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
    setSelectedCompanyData(undefined);
  };

  return (
    <>
      <VisitorsTableContainer onCompanySelect={handleCompanySelect} />
      <CompanyDetailsDrawer open={drawerOpen} onClose={handleDrawerClose} companyData={selectedCompanyData} />
    </>
  );
};

export default VisitorsTable;
