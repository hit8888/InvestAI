import type { DrawerContentProps } from '../../../features/table-system';
import { X } from 'lucide-react';
import { Drawer, DrawerContent } from '@breakout/design-system/components/Drawer/index';
import Typography from '@breakout/design-system/components/Typography/index';
import Button from '@breakout/design-system/components/Button/index';

interface CustomAttributes {
  employee_count?: string;
  raw_demographics?: string;
}

interface CompanyRow {
  id: number;
  domain: string | null;
  name: string | null;
  core_company: number | null;
  relevance_score: number | null;
  relevance_score_reasoning: string | null;
  visitor_count: number;
  is_customer: boolean;
  custom_attributes: CustomAttributes;
  created_on: string;
  updated_on: string;
  [key: string]: unknown;
}

/**
 * Drawer content for company details
 * Simple implementation showing row ID and sample text
 */
export const CompanyDrawerContent = ({ data, onClose }: DrawerContentProps<CompanyRow>) => {
  // Note: isTableLoading is available but not used since this drawer doesn't fetch additional data
  const handleCloseDrawer = () => {
    onClose();
  };

  return (
    <Drawer open={true} onOpenChange={handleCloseDrawer} direction="right">
      <DrawerContent
        className="z-[1001] ml-auto flex h-screen w-1/2 flex-row justify-end gap-4 rounded-none border-none"
        data-vaul-no-drag
      >
        <div className="relative w-full">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 p-6">
            <div>
              <Typography variant="title-24" className="text-gray-900">
                Company Details
              </Typography>
              <Typography variant="body-14" className="text-gray-500">
                Row ID: {data.id}
              </Typography>
            </div>
            <Button variant="system_secondary" size="regular" onClick={handleCloseDrawer} className="h-8 w-8 p-0">
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-6">
              <div className="rounded-lg border border-gray-200 p-4">
                <Typography variant="body-16" className="mb-4 text-gray-900">
                  Sample Company Information
                </Typography>

                <div className="space-y-4">
                  <div>
                    <Typography variant="caption-12-medium" className="text-gray-500">
                      Company Name
                    </Typography>
                    <Typography variant="body-14" className="text-gray-900">
                      {data.name || 'Unknown Company'}
                    </Typography>
                  </div>

                  <div>
                    <Typography variant="caption-12-medium" className="text-gray-500">
                      Domain
                    </Typography>
                    <Typography variant="body-14" className="text-gray-900">
                      {data.domain || 'N/A'}
                    </Typography>
                  </div>

                  <div>
                    <Typography variant="caption-12-medium" className="text-gray-500">
                      Visitor Count
                    </Typography>
                    <Typography variant="body-14" className="text-gray-900">
                      {data.visitor_count || 0}
                    </Typography>
                  </div>

                  <div>
                    <Typography variant="caption-12-medium" className="text-gray-500">
                      Is Customer
                    </Typography>
                    <Typography variant="body-14" className="text-gray-900">
                      {data.is_customer ? 'Yes' : 'No'}
                    </Typography>
                  </div>

                  {data.custom_attributes?.employee_count && (
                    <div>
                      <Typography variant="caption-12-medium" className="text-gray-500">
                        Employee Count
                      </Typography>
                      <Typography variant="body-14" className="text-gray-900">
                        {data.custom_attributes.employee_count}
                      </Typography>
                    </div>
                  )}

                  {data.relevance_score !== null && (
                    <div>
                      <Typography variant="caption-12-medium" className="text-gray-500">
                        Relevance Score
                      </Typography>
                      <Typography variant="body-14" className="text-gray-900">
                        {data.relevance_score}
                      </Typography>
                    </div>
                  )}

                  {data.relevance_score_reasoning && (
                    <div>
                      <Typography variant="caption-12-medium" className="text-gray-500">
                        Relevance Reasoning
                      </Typography>
                      <Typography variant="body-14" className="text-gray-900">
                        {data.relevance_score_reasoning}
                      </Typography>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
