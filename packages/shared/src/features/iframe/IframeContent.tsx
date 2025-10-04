import { useState } from 'react';

import PreviewDialog from '../../components/PreviewDialog';
import { Input, Button, Label } from '@meaku/saral';
import useUpdateProspectMutation from '../../network/http/mutations/useUpdateProspectMutation';
import { FeatureContentProps } from '../';
import { useCommandBarStore } from '../../stores/useCommandBarStore';
import useFeatureConfig from '../../hooks/useFeatureConfig';
import { CommandBarModuleTypeSchema } from '@meaku/core/types/api/configuration_response';
import { getLocalStorageData, setLocalStorageData } from '@meaku/core/utils/storage-utils';

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

  // Calculate dialog width based on module config or use default
  const dialogWidth = width ? `${width}px` : '50vw';
  const maxDialogWidth = width ? `${width}px` : '90vw';

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
    <PreviewDialog open title={name} onOpenChange={onClose} width={dialogWidth} maxWidth={maxDialogWidth}>
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
        <iframe src={url} title={name} className="h-full w-full rounded-lg" loading="lazy" />
      )}
    </PreviewDialog>
  );
};

export default IframeContent;
