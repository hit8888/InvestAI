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
        <div className="flex h-64 w-full flex-col items-start gap-4 self-stretch rounded-2xl border border-[#EDECFB] p-4">
          <div className="flex w-full flex-col items-start gap-4 self-stretch">
            <div className="flex w-full items-center gap-6 self-stretch">
              <div className="flex w-full items-center gap-6">
                <p className="text-2xl font-semibold tracking-[0.24px] text-[#101828]">Leads for the period</p>
                <div className="flex items-center gap-2">
                  <div className="flex h-5 w-5 animate-numberOfLeadsOuter items-center justify-center gap-[10px] rounded-md bg-[#DCDAF8] p-[10px] 2xl:h-8 2xl:w-8">
                    <div className="flex h-3 w-3 flex-shrink-0 animate-numberOfLeadsInner rounded-sm bg-[#4E46DC] 2xl:h-5 2xl:w-5"></div>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-normal tracking-[0.14px] text-[#667085]">Total:</p>
                    <p className="text-sm font-medium text-[#101828]">{totalNumberOfLeads} Lead</p>
                  </div>
                </div>
              </div>
              <div className="flex w-full flex-1 items-start">
                <div className="flex h-10 w-80 items-center gap-2 rounded-lg border border-[#DCDAF8] bg-[#FBFBFE] p-2"></div>
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
