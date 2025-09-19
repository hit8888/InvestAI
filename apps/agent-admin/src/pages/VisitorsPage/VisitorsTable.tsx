import VisitorsTableContainer from './components/VisitorsTableContainer';
import CompanyDetailsDrawer from './components/CompanyDetailsDrawer';
import { useSearchParams } from 'react-router-dom';

const VisitorsTable = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const handleCompanySelect = (prospectId: string) => {
    if (!prospectId) {
      return;
    }

    setSearchParams((prev) => {
      prev.set('rowId', prospectId);
      return prev;
    });
  };

  const handleDrawerClose = () => {
    setSearchParams((prev) => {
      prev.delete('rowId');
      return prev;
    });
  };

  return (
    <>
      <VisitorsTableContainer onCompanySelect={handleCompanySelect} />
      <CompanyDetailsDrawer
        open={!!searchParams.get('rowId')}
        onClose={handleDrawerClose}
        prospectId={searchParams.get('rowId') ?? ''}
      />
    </>
  );
};

export default VisitorsTable;
