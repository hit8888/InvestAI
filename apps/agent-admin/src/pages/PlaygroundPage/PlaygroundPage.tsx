import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

import SettingsPanel from './components/SettingsPanel';
import PlaygroundHeader from './components/PlaygroundHeader';
import PlaygroundBottomControls from './components/PlaygroundBottomControls';
// import WebsiteBackgroundToggle from './components/WebsiteBackgroundToggle';
import { cn } from '@breakout/design-system/lib/cn';
import Typography from '@breakout/design-system/components/Typography/index';
// import { Form, FormControl, FormField, FormItem } from '@breakout/design-system/components/layout/form';
import usePlaygroundOptions from '../../hooks/usePlaygroundOptions';
import { AppRoutesEnum } from '../../utils/constants';
import { useSidebar } from '../../context/SidebarContext';
import bcDefault from '/bc_default.png';
import { jsonSafeParse } from '@meaku/core/utils/index';

export interface SettingsFormData {
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
  bo_enabled: 'true',
};

const NEW_SESSION_PARAMS = {
  bo_prospect_id: '',
  bo_session_id: '',
};

const TWO_DAYS_IN_MS = 2 * 24 * 60 * 60 * 1000;

const AGENT_PLAYGROUND_BASE_URL = import.meta.env.VITE_AGENT_PLAYGROUND_BASE_URL;

const PLAYGROUND_FORM_STORAGE_KEY = 'meaku_playground_form_data';

const loadSavedFormData = (): SettingsFormData | null => {
  const saved = localStorage.getItem(PLAYGROUND_FORM_STORAGE_KEY);
  return saved ? jsonSafeParse(saved).data : null;
};

const clearSavedFormData = (): void => {
  try {
    localStorage.removeItem(PLAYGROUND_FORM_STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear saved form data:', error);
  }
};

const saveFormData = (formData: SettingsFormData): void => {
  try {
    localStorage.setItem(PLAYGROUND_FORM_STORAGE_KEY, JSON.stringify(formData));
  } catch (error) {
    console.error('Failed to save form data:', error);
  }
};

const PlaygroundPage = () => {
  const [viewType, setViewType] = useState<'desktop' | 'mobile'>('desktop');
  const [isSettingsPanelCollapsed, setIsSettingsPanelCollapsed] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const { orgAgentId, tenantName } = usePlaygroundOptions();
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const { toggleSidebar, isCollapsed: isSidebarCollapsed } = useSidebar();

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

    if (openInNewTab) {
      const previewPageUrl = `/${tenantName}/${AppRoutesEnum.TRAINING_PLAYGROUND_PREVIEW}?previewUrl=${encodeURIComponent(newUrl)}`;
      window.open(previewPageUrl, '_blank');
    }

    setPreviewUrl(newUrl);
    if (iframeRef.current) {
      iframeRef.current.src = newUrl;
    }

    saveFormData(formValues);
    form.reset(formValues);
  };

  const handleClearAll = () => {
    clearSavedFormData();
    form.reset(DEFAULT_FORM_VALUES);
  };

  const handleRefresh = () => {
    handleClearAll();

    const newUrl = `${AGENT_PLAYGROUND_BASE_URL}?bo_tenant_id=${tenantName}&bo_agent_id=${orgAgentId}&${new URLSearchParams({ ...DEFAULT_PARAMS, ...NEW_SESSION_PARAMS }).toString()}`;

    setPreviewUrl(newUrl);

    if (iframeRef.current) {
      iframeRef.current.src = newUrl;
    }
  };

  useEffect(() => {
    const wasInitiallyExpanded = !isSidebarCollapsed;

    if (wasInitiallyExpanded) {
      toggleSidebar();
    }

    return () => {
      if (wasInitiallyExpanded) {
        toggleSidebar();
      }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const savedFormData = loadSavedFormData();

    if (savedFormData) {
      Object.entries(savedFormData).forEach(([key, value]) => {
        form.setValue(key as keyof SettingsFormData, value);
      });
    }
  }, [form]);

  return (
    <div className="relative flex h-full max-h-screen w-full">
      <div
        className={cn('relative z-50 flex w-[370px] flex-col shadow-lg', {
          'absolute left-0 top-0 rounded-lg': isSettingsPanelCollapsed,
          'shrink-0 border-r border-gray-100': !isSettingsPanelCollapsed,
        })}
      >
        <PlaygroundHeader
          deviceType={viewType}
          onDeviceTypeChange={setViewType}
          onRefresh={handleRefresh}
          isCollapsed={isSettingsPanelCollapsed}
          onToggleCollapse={() => setIsSettingsPanelCollapsed((prev) => !prev)}
        />
        {!isSettingsPanelCollapsed && (
          <>
            <SettingsPanel form={form} isCollapsed={isSettingsPanelCollapsed} />
            <PlaygroundBottomControls
              onPreviewAgent={form.handleSubmit((values) => handlePreviewAgent(values, false))}
              onExternalPreview={form.handleSubmit((values) => handlePreviewAgent(values, true))}
              onClearAll={handleClearAll}
              isPreviewDisabled={!!previewUrl && !form.formState.isDirty}
              isClearAllDisabled={!form.formState.isDirty}
            />
          </>
        )}
      </div>

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

        {previewUrl ? (
          <iframe
            ref={iframeRef}
            src={previewUrl}
            className={cn('h-full w-full', {
              'h-[667px] w-[375px] rounded-xl border': viewType === 'mobile',
            })}
            title="Playground Agent"
          />
        ) : (
          <div
            className={cn(
              'relative flex h-full w-full items-center justify-center bg-gray-50 bg-cover bg-center bg-no-repeat',
              {
                'h-[667px] w-[375px] rounded-xl border border-gray-200': viewType === 'mobile',
              },
            )}
            style={{ backgroundImage: `url(${bcDefault})` }}
          >
            <Typography variant="body-16" className="text-gray-500">
              Click on Preview to load agent
            </Typography>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlaygroundPage;
