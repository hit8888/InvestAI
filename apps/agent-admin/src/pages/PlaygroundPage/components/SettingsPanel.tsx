import React, { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem } from '@breakout/design-system/components/layout/form';
import { SettingsFormData } from '../PlaygroundPage';
import DeviceTypeSwitcher from './DeviceTypeSwitcher';
import ToggleSection from './ToggleSection';
import LandingPageUrlInput from './LandingPageUrlInput';
import BrowsingHistorySection from './BrowsingHistorySection';
import UtmParametersSection from './UtmParametersSection';
import VisitorCompanyInput from './VisitorCompanyInput';
import SettingsPanelHeader from './SettingsPanelHeader';
import SettingsPanelControls from './SettingsPanelControls';

interface SettingsPanelProps {
  form: UseFormReturn<SettingsFormData>;
  onExternalPreview: () => void;
  onPreviewAgent: () => void;
  onRefresh: () => void;
  isPreviewDisabled: boolean;
  isRefreshDisabled: boolean;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({
  form,
  onExternalPreview,
  onPreviewAgent,
  onRefresh,
  isPreviewDisabled,
  isRefreshDisabled,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div
      className={`z-50 flex w-[370px] shrink-0 flex-col border-r border-gray-100 shadow-lg ${isCollapsed ? 'absolute left-4 top-4 rounded-xl' : ''}`}
    >
      {/* Header */}
      <SettingsPanelHeader
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        onExternalPreview={onExternalPreview}
      />

      {/* Scrollable Content */}
      {!isCollapsed && (
        <div className="flex-1 overflow-y-auto">
          <div className="space-y-6 p-6">
            <Form {...form}>
              {/* Device Type Switcher */}
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="deviceType"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <DeviceTypeSwitcher field={field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              {/* Divider */}
              <div className="border-t border-gray-200"></div>

              {/* Repeat User Toggle */}
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

              {/* Divider */}
              <div className="border-t border-gray-200"></div>

              {/* Provide Feedback Toggle */}
              <FormField
                control={form.control}
                name="provideFeedback"
                render={({ field }) => (
                  <ToggleSection
                    field={field}
                    label="Provide Feedback"
                    tooltip="Turning this on will allow you to provide feedback to agent's responses"
                  />
                )}
              />

              {/* Divider */}
              <div className="border-t border-gray-200"></div>

              {/* Landing Page URL */}
              <FormField
                control={form.control}
                name="landingPageUrl"
                render={({ field }) => <LandingPageUrlInput field={field} />}
              />

              {/* Browsing History */}
              <BrowsingHistorySection form={form} />

              {/* Divider */}
              <div className="border-t border-gray-200"></div>

              {/* UTM Parameters */}
              <UtmParametersSection form={form} />

              {/* Divider */}
              <div className="border-t border-gray-200"></div>

              {/* Visitor Company */}
              <FormField
                control={form.control}
                name="visitorCompany"
                render={({ field }) => <VisitorCompanyInput field={field} />}
              />
            </Form>
          </div>
        </div>
      )}

      {/* Bottom Controls */}
      {!isCollapsed && (
        <SettingsPanelControls
          onRefresh={onRefresh}
          onPreviewAgent={onPreviewAgent}
          isPreviewDisabled={isPreviewDisabled}
          isRefreshDisabled={isRefreshDisabled}
        />
      )}
    </div>
  );
};

export default SettingsPanel;
