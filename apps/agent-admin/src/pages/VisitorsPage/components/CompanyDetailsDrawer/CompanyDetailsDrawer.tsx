import { Drawer, DrawerContent } from '@breakout/design-system/components/Drawer/index';
import { X } from 'lucide-react';
import CompanyDetailsContent from './CompanyDetailsContent';
import LoadingContent from './LoadingContent';
import type { CompanyData } from './types';
import useSessionDetailsQuery from '../../../../queries/query/useSessionDetailsQuery';

type CompanyDetailsDrawerProps = {
  open: boolean;
  onClose: () => void;
  companyData?: CompanyData;
};

const CompanyDetailsDrawer = ({ open, onClose, companyData }: CompanyDetailsDrawerProps) => {
  const { data, isLoading } = useSessionDetailsQuery({ sessionId: companyData?.session_id });

  return (
    <Drawer open={open} onOpenChange={onClose} direction="right">
      {open && (
        <DrawerContent className="z-[1000] ml-[50%] h-screen rounded-none bg-white" data-vaul-no-drag>
          <div className="flex h-full w-full flex-col">
            {/* Header with close button */}
            <div className="flex justify-end p-3">
              <button
                onClick={onClose}
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
                <CompanyDetailsContent
                  companyData={
                    companyData
                      ? {
                          ...companyData,
                          conversationSummary: data?.chat_summary ?? '',
                          browsingHistorySummary: data?.prospect?.browsing_analysis_summary ?? '',
                        }
                      : undefined
                  }
                />
              )}
            </div>
          </div>
        </DrawerContent>
      )}
    </Drawer>
  );
};

export default CompanyDetailsDrawer;
