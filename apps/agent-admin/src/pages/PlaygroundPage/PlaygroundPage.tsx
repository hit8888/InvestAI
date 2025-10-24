import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

import SettingsPanel from './components/SettingsPanel';
// import WebsiteBackgroundToggle from './components/WebsiteBackgroundToggle';
import { cn } from '@breakout/design-system/lib/cn';
// import { Form, FormControl, FormField, FormItem } from '@breakout/design-system/components/layout/form';
import usePlaygroundOptions from '../../hooks/usePlaygroundOptions';
import { AppRoutesEnum } from '../../utils/constants';

export interface SettingsFormData {
  deviceType: 'desktop' | 'mobile';
  repeatUser: boolean;
  provideFeedback: boolean;
  landingPageUrl: string;
  browsingHistory: Array<{ id: string; url: string; order: number }>;
  utmParameters: Array<{ id: string; key: string; value: string }>;
  visitorCompany: string;
  userLocation: string;
  addWebsiteBackground: boolean;
}

const DEFAULT_FORM_VALUES: SettingsFormData = {
  deviceType: 'desktop',
  repeatUser: false,
  provideFeedback: false,
  landingPageUrl: '',
  browsingHistory: [],
  utmParameters: [],
  visitorCompany: '',
  userLocation: '',
  addWebsiteBackground: false,
};

const DEFAULT_PARAMS = {
  bo_is_admin: 'true',
  bo_is_test: 'true',
};

const TWO_DAYS_IN_MS = 2 * 24 * 60 * 60 * 1000;

const AGENT_PLAYGROUND_BASE_URL = import.meta.env.VITE_AGENT_PLAYGROUND_BASE_URL;

const PlaygroundPage = () => {
  const [viewType, setViewType] = useState(DEFAULT_FORM_VALUES.deviceType);
  const { orgAgentId, tenantName } = usePlaygroundOptions();
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const defaultPreviewUrl =
    orgAgentId && tenantName
      ? `${AGENT_PLAYGROUND_BASE_URL}?bo_tenant_id=${tenantName}&bo_agent_id=${orgAgentId}&${new URLSearchParams(DEFAULT_PARAMS).toString()}`
      : '';

  const form = useForm<SettingsFormData>({
    defaultValues: DEFAULT_FORM_VALUES,
  });

  const generateSettingsParams = (formValues: SettingsFormData) => {
    const browsingHistory = formValues.browsingHistory?.map((history, index) => ({
      url: history.url,
      timestamp: formValues.repeatUser
        ? Date.now() + TWO_DAYS_IN_MS + index * 1000 // 2 days is added to the base timestamp and 1 second is added for each history item
        : Date.now() + index * 1000, // 1 second is added for each history item
    }));

    const utmFormValues = formValues.utmParameters?.map((param) => [param.key, param.value]) ?? [];

    if (formValues.visitorCompany) {
      utmFormValues.push(['bo_company', formValues.visitorCompany]);
    }

    const utmParameters = Object.fromEntries(utmFormValues);

    const params = {
      bo_parent_url: formValues.landingPageUrl,
      bo_browsed_urls: browsingHistory.length > 0 ? JSON.stringify(browsingHistory) : '',
      bo_query_params: Object.keys(utmParameters).length > 0 ? JSON.stringify(utmParameters) : '',
      bo_bc: formValues.addWebsiteBackground ? 'true' : 'false',
      bo_company: formValues.visitorCompany,
      bo_location: formValues.userLocation,
      bo_agent_id: orgAgentId?.toString() ?? '',
      bo_tenant_id: tenantName ?? '',
      bo_feedback_enabled: formValues.provideFeedback ? 'true' : 'false',
      ...DEFAULT_PARAMS,
    };

    const filteredParams = Object.entries(params).filter(([_, value]) => !!value);
    return Object.fromEntries(filteredParams);
  };

  const handlePreviewAgent = (formValues: SettingsFormData, openInNewTab: boolean = false) => {
    const settingsParams = generateSettingsParams(formValues);
    const newUrl = `${AGENT_PLAYGROUND_BASE_URL}?${new URLSearchParams(settingsParams).toString()}`;
    setViewType(formValues.deviceType);

    if (openInNewTab) {
      const previewPageUrl = `/${tenantName}/${AppRoutesEnum.TRAINING_PLAYGROUND_PREVIEW}?previewUrl=${encodeURIComponent(newUrl)}`;
      window.open(previewPageUrl, '_blank');
    } else if (iframeRef.current) {
      iframeRef.current.src = newUrl;
    }

    form.reset(formValues);
  };

  const handleRefresh = () => {
    if (iframeRef.current) {
      form.reset(DEFAULT_FORM_VALUES);
      iframeRef.current.src = defaultPreviewUrl;
      setViewType(DEFAULT_FORM_VALUES.deviceType);
    }
  };

  return (
    <div className="relative flex h-full max-h-screen w-full">
      <SettingsPanel
        form={form}
        isPreviewDisabled={!form.formState.isDirty}
        isRefreshDisabled={!form.formState.isSubmitted}
        onExternalPreview={form.handleSubmit((values) => handlePreviewAgent(values, true))}
        onPreviewAgent={form.handleSubmit((values) => handlePreviewAgent(values, false))}
        onRefresh={handleRefresh}
      />

      <div className="relative flex h-full w-full items-center justify-center">
        {/* Add Website Background Field - positioned absolutely at center top */}
        {/* <div className="absolute left-1/2 top-4 z-10 w-56 -translate-x-1/2 transform">
          <Form {...form}>
            <FormField
              control={form.control}
              name="addWebsiteBackground"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <WebsiteBackgroundToggle field={field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </Form>
        </div> */}

        <iframe
          ref={iframeRef}
          src={defaultPreviewUrl}
          className={cn('h-full w-full', {
            'h-[667px] w-[375px] rounded-xl border': viewType === 'mobile',
          })}
          title="Playground Agent"
        />
      </div>
    </div>
  );
};

export default PlaygroundPage;
