import { useAuth } from '../context/AuthProvider';
import CustomPageHeader from '../components/CustomPageHeader';
import LeadsIcon from '@breakout/design-system/components/icons/leads-icon';
import TableContainer from '../components/tableComp/TableContainer';

const LeadsPage = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return null;
  }

  const totalNumberOfLeads = 1;
  return (
    <>
      <div className="flex flex-col items-start gap-6 self-stretch">
        <CustomPageHeader headerTitle="Leads Page" headerIcon={<LeadsIcon />} />
        <div className="flex h-[270px] w-full flex-col items-start gap-4 self-stretch rounded-2xl border border-[#EDECFB] p-4">
          <div className="flex w-full flex-col items-start gap-4 self-stretch">
            <div className="flex w-full items-center gap-6 self-stretch">
              <div className="flex w-full items-center gap-6">
                <p className="font-inter text-[24px] font-semibold leading-normal tracking-[0.24px] text-[#101828]">
                  Leads for the period
                </p>
                <div className="flex items-center gap-2">
                  <div className="flex h-[20px] w-[20px] animate-numberOfLeadsOuter items-center justify-center gap-[10px] rounded-md bg-[#DCDAF8] p-[10px] 2xl:h-[30px] 2xl:w-[30px]">
                    <div className="flex h-[12px] w-[12px] flex-shrink-0 animate-numberOfLeadsInner flex-col items-start gap-[10px] rounded-sm bg-[#4E46DC] 2xl:h-[20px] 2xl:w-[20px]"></div>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="font-inter text-[14px] font-normal leading-[20px] tracking-[0.14px] text-[#667085]">
                      Total:
                    </p>
                    <p className="font-inter text-[14px] font-medium leading-[20px] text-[#101828]">
                      {totalNumberOfLeads} Lead
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex w-full flex-1 items-start">
                <div className="flex h-[40px] w-[324px] items-center gap-2 rounded-lg border border-[#DCDAF8] bg-[#FBFBFE] p-2"></div>
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
