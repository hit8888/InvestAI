import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';

import { Drawer, DrawerContent } from '@breakout/design-system/components/Drawer/index';
import LoadingContent from './LoadingContent';
import type { CompanyData, Employee } from './types';
import useSessionDetailsQuery from '../../../../queries/query/useSessionDetailsQuery';
import { BrowsingConversationSummary, CompanyInfoSection } from '.';
import IcpSection from './IcpSection';
import useIcpsQuery from '../../../../queries/query/useIcpsQuery';
import useReachoutEmailQuery from '../../../../queries/query/useReachoutEmailQuery';
import GeneratedEmailCard from './GeneratedEmailCard';
import useIcpDetailsQuery from '../../../../queries/query/useIcpDetailsQuery';
import { cn } from '@breakout/design-system/lib/cn';

type CompanyDetailsDrawerProps = {
  open: boolean;
  onClose: () => void;
  companyData?: CompanyData;
};

const CompanyDetailsDrawer = ({ open, onClose, companyData }: CompanyDetailsDrawerProps) => {
  const navigate = useNavigate();
  const bodyHtmlRef = useRef<HTMLDivElement | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  const { data, isLoading } = useSessionDetailsQuery({ sessionId: companyData?.prospect?.session_id });
  const {
    data: icpList,
    isLoading: isIcpListLoading,
    refetch: fetchIcpList,
  } = useIcpsQuery({ companyName: companyData?.name }, { enabled: false, retry: false });
  const {
    data: icpDetails,
    isLoading: isIcpDetailsLoading,
    refetch: fetchIcpDetails,
  } = useIcpDetailsQuery({ icpId: selectedEmployee?.icp_id }, { enabled: false, retry: false });
  const { data: emailData, isLoading: emailDataLoading } = useReachoutEmailQuery(
    {
      email_type: selectedEmployee?.icp_id ? 'prospective_icp' : 'website_user',
      session_id: companyData?.prospect?.session_id ?? undefined,
      icp_id: selectedEmployee?.icp_id ?? undefined,
    },
    {
      enabled: !!selectedEmployee,
      retry: false,
    },
  );

  const icps: Employee[] =
    icpList?.contacts?.map?.((icp) => ({
      icp_id: icp.id,
      name: icp.name,
      title: icp.title,
      avatar: icp.profile_picture_url,
    })) || [];
  const completedCompanyData = companyData
    ? {
        ...companyData,
        conversationSummary: data?.chat_summary ?? '',
        browsingHistorySummary: data?.prospect?.browsing_analysis_summary ?? '',
      }
    : undefined;

  const handleSeeAllDetails = () => {
    if (companyData?.prospect?.session_id) {
      navigate(`${companyData.prospect.session_id}`, {
        state: { from: 'prospects' },
      });
    }
  };

  const handleCloseDrawer = () => {
    setSelectedEmployee(null);
    onClose();
  };

  return (
    <Drawer open={open} onOpenChange={handleCloseDrawer} direction="right">
      {open && (
        <DrawerContent
          className="z-[1000] ml-[50%] flex h-screen flex-row justify-end gap-4 rounded-none border-none"
          data-vaul-no-drag
        >
          <div className="relative w-full">
            <div
              className={cn(
                'absolute -left-[31vw] bottom-0 mb-4 flex h-3/4 w-[30vw] flex-col gap-3 self-end rounded-2xl bg-white p-4 transition-all duration-500',
                { 'pointer-events-none opacity-0': !selectedEmployee },
              )}
            >
              <GeneratedEmailCard
                selectedEmployee={
                  selectedEmployee
                    ? {
                        ...selectedEmployee,
                        email: selectedEmployee?.icp_id ? icpDetails?.contact?.email : selectedEmployee?.email,
                      }
                    : null
                }
                isLoadingIcpDetails={isIcpDetailsLoading}
                emailData={emailData}
                emailDataLoading={emailDataLoading}
                bodyHtmlRef={bodyHtmlRef}
                fetchIcpDetails={fetchIcpDetails}
              />
            </div>
            <div className="flex h-full w-full flex-col bg-white">
              {/* Header with close button */}
              <div className="flex justify-end p-3">
                <button
                  onClick={handleCloseDrawer}
                  className="flex h-6 w-6 items-center justify-center rounded hover:bg-gray-100"
                  aria-label="Close drawer"
                >
                  <X className="h-4 w-4 text-gray-400" />
                </button>
              </div>

              {/* Content */}
              <div className="flex flex-1 flex-col gap-3 overflow-auto px-5 pb-5">
                {isLoading ? (
                  <LoadingContent />
                ) : (
                  <>
                    {/* Company Info Section */}
                    <CompanyInfoSection companyData={completedCompanyData} />

                    {/* Employees Section */}
                    <IcpSection
                      prospect={completedCompanyData?.prospect}
                      icps={icps}
                      isLoading={isIcpListLoading}
                      onFetchIcpList={fetchIcpList}
                      onGenerateEmail={setSelectedEmployee}
                      selectedEmployee={selectedEmployee}
                    />

                    {/* Browsing & Conversation Summary */}
                    <BrowsingConversationSummary
                      companyData={completedCompanyData}
                      onSeeAllDetails={handleSeeAllDetails}
                    />
                  </>
                )}
              </div>
            </div>
          </div>
        </DrawerContent>
      )}
    </Drawer>
  );
};

export default CompanyDetailsDrawer;
