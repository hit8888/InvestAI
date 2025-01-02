import CustomPageHeader from '../components/CustomPageHeader';
import LeadsIcon from '@breakout/design-system/components/icons/leads-icon';
import TableContainer from '../components/tableComp/TableContainer';
import { PAGE_HEADER_TITLE_ICON_PROPS } from '../utils/constants';

const LeadsPage = () => {
  const totalNumberOfLeads = 1;
  return (
    <>
      <div className="flex flex-col items-start gap-6 self-stretch">
        <CustomPageHeader headerTitle="Leads Page" headerIcon={<LeadsIcon {...PAGE_HEADER_TITLE_ICON_PROPS} />} />
        <div className="flex h-64 w-full flex-col items-start gap-4 self-stretch rounded-2xl border border-primary/10 p-4">
          <div className="flex w-full flex-col items-start gap-4 self-stretch">
            <div className="flex w-full items-center gap-6 self-stretch">
              <div className="flex w-full items-center gap-6">
                <p className="text-2xl font-semibold text-gray-900">Leads for the period</p>
                <div className="flex items-center gap-2">
                  <div className="flex h-5 w-5 animate-pulse items-center justify-center gap-[10px] rounded-md bg-primary/20 p-[10px] 2xl:h-8 2xl:w-8">
                    <div className="flex h-3 w-3 flex-shrink-0 animate-pulse rounded-sm bg-primary 2xl:h-5 2xl:w-5"></div>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-normal text-gray-500">Total:</p>
                    <p className="text-sm font-medium text-gray-900">{totalNumberOfLeads} Lead</p>
                  </div>
                </div>
              </div>
              <div className="flex w-full flex-1 items-start">
                <div className="flex h-10 w-80 items-center gap-2 rounded-lg border border-primary/20 bg-primary/2.5 p-2"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <TableContainer />
    </>
  );
};

export default LeadsPage;
