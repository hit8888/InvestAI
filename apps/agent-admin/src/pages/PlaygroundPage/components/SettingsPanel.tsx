import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Form, FormField } from '@breakout/design-system/components/layout/form';
import { SettingsFormData } from '../PlaygroundPage';
import ToggleSection from './ToggleSection';
import LandingPageUrlInput from './LandingPageUrlInput';
import BrowsingHistorySection from './BrowsingHistorySection';
import UtmParametersSection from './UtmParametersSection';
import VisitorCompanyInput from './VisitorCompanyInput';
import { Info } from 'lucide-react';
import Typography from '@breakout/design-system/components/Typography/index';
import TooltipWrapperDark from '@breakout/design-system/components/Tooltip/TooltipWrapperDark';

interface SettingsPanelProps {
  form: UseFormReturn<SettingsFormData>;
  isCollapsed: boolean;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ form, isCollapsed }) => {
  if (isCollapsed) {
    return null;
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="flex flex-col gap-4 bg-gray-25 px-6 pb-6 pt-0">
        <Form {...form}>
          {/* Repeat User Toggle Section */}
          <div className="mt-4 flex flex-col gap-4">
            <FormField
              control={form.control}
              name="repeatUser"
              render={({ field }) => (
                <ToggleSection
                  field={field}
                  label="Repeat User"
                  tooltip="Simulate the experience for a visitor coming back to your site"
                />
              )}
            />
          </div>

          {/* Provide Feedback Toggle Section */}
          <div className="flex flex-col gap-4">
            <div className="border-t border-gray-200"></div>
            <FormField
              control={form.control}
              name="provideFeedback"
              render={({ field }) => (
                <ToggleSection
                  field={field}
                  label="Admin View"
                  tooltip="Turning this on will allow you to provide feedback to agent's responses"
                />
              )}
            />
          </div>

          {/* Browsing Journey Section */}
          <div className="flex flex-col gap-4">
            <div className="border-t border-gray-200"></div>
            <div className="flex flex-col">
              <div className="mb-3 flex items-center gap-2">
                <Typography variant="label-14-medium">Browsing Journey</Typography>
                <TooltipWrapperDark
                  showTooltip
                  showArrow={false}
                  content="Shows the user's recent journey before arriving on the current page"
                  trigger={<Info className="h-4 w-4 text-gray-900" />}
                  tooltipSide="top"
                  tooltipAlign="start"
                />
              </div>

              {/* Landing Page URL */}
              <div className="flex flex-col gap-1">
                <Typography variant="caption-12-medium" className="text-gray-500">
                  Current Page URL
                </Typography>
                <FormField
                  control={form.control}
                  name="landingPageUrl"
                  render={({ field }) => <LandingPageUrlInput field={field} />}
                />
              </div>

              {/* Browsing History */}
              <BrowsingHistorySection form={form} />
            </div>
          </div>

          {/* UTM Parameters Section */}
          <div className="flex flex-col gap-4">
            <div className="border-t border-gray-200"></div>
            <UtmParametersSection form={form} />
          </div>

          {/* Visitor Company Section */}
          <div className="flex flex-col gap-4">
            <div className="border-t border-gray-200"></div>
            <div className="flex flex-col gap-3">
              <FormField
                control={form.control}
                name="visitorCompany"
                render={({ field }) => <VisitorCompanyInput field={field} />}
              />
            </div>
          </div>

          {/* TODO: Will be added later */}
          {/* User Location Section */}
          {/* <div className="flex flex-col gap-4">
            <div className="border-t border-gray-200"></div>
            <div className="flex flex-col gap-3">
              <Typography variant="label-14-medium">User Location</Typography>
              <FormField
                control={form.control}
                name="userLocation"
                render={({ field }) => (
                  <PlacesAutocomplete
                    placeholder="Search for a location"
                    defaultValue={field.value}
                    onPlaceSelect={(place: PlaceData | null) => {
                      field.onChange(place?.description || '');
                    }}
                    onBlur={field.onBlur}
                    requestOptions={{
                      types: ['(cities)'],
                    }}
                  />
                )}
              />
            </div>
          </div> */}
        </Form>
      </div>
    </div>
  );
};

export default SettingsPanel;
