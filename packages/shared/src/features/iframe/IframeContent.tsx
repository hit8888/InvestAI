import { useState } from 'react';

import { FeatureHeader } from '../../components/FeatureHeader';
import { Input, Button, Label } from '@neuraltrade/saral';
import useUpdateProspectMutation from '../../network/http/mutations/useUpdateProspectMutation';
import { FeatureContentProps } from '../';
import { useCommandBarStore } from '../../stores/useCommandBarStore';
import useFeatureConfig from '../../hooks/useFeatureConfig';
import { CommandBarModuleTypeSchema } from '@neuraltrade/core/types/api/configuration_response';
import { getLocalStorageData, setLocalStorageData } from '@neuraltrade/core/utils/storage-utils';

export const IframeContent = ({ onClose }: FeatureContentProps) => {
  const { config } = useCommandBarStore();
  const featureConfig = useFeatureConfig(CommandBarModuleTypeSchema.enum.IFRAME);
  const [email, setEmail] = useState('');

  const { mutate, isSuccess, isPending } = useUpdateProspectMutation({
    onSuccess: () => {
      if (!featureConfig || !config.command_bar) return;

      setLocalStorageData({
        prospect_info_collected: true,
      });
    },
  });

  if (!featureConfig?.module_configs?.url) {
    return null;
  }

  const { name, module_configs: moduleConfig } = featureConfig;
  const { gated, url, width } = moduleConfig;
  const showEmailForm = gated && !isSuccess && !getLocalStorageData()?.prospect_info_collected;

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !config.prospect_id) return;

    mutate({
      prospectId: config.prospect_id,
      payload: {
        email,
      },
    });
  };

  return (
    <div className="flex w-full h-full flex-col rounded-[20px] border border-border-dark bg-background">
      {/* Sticky Header */}
      <div className="sticky top-0 z-20 bg-background">
        <FeatureHeader title={name} onClose={onClose} ctas={[]} />
      </div>

      {/* Content Container */}
      <div className="flex-1 min-h-0 overflow-hidden">
        {showEmailForm ? (
          <div className="flex h-full flex-col items-center justify-center p-6">
            <form onSubmit={handleEmailSubmit} className="w-80 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full"
                />
              </div>

              <Button hasWipers type="submit" className="w-full" disabled={!email.trim()}>
                {isPending ? 'Submitting...' : 'Submit'}
              </Button>
            </form>
          </div>
        ) : (
          <iframe
            src={url}
            title={name}
            className="h-full w-full rounded-lg bg-card"
            loading="lazy"
            style={{
              ...(width && { maxWidth: `${width}px` }),
              minHeight: '684px',
            }}
          />
        )}
      </div>
    </div>
  );
};

export default IframeContent;
