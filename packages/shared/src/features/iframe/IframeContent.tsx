import { useState } from 'react';
import PreviewDialog from '../../components/PreviewDialog';
import { CommandBarModuleConfigType, ConfigurationApiResponse } from '@meaku/core/types/api/configuration_response';
import { Input, Button, Label } from '@meaku/saral';
import useUpdateProspectMutation from '../../network/http/mutations/useUpdateProspectMutation';
import { useQueryClient } from '@tanstack/react-query';
import { dynamicConfigDataKey } from '../../network/http/queries/useDynamicConfigDataQuery';
import { CommandBarSettings } from '@meaku/core/types/common';

interface IframeContentProps {
  config: ConfigurationApiResponse;
  settings: CommandBarSettings;
  featureConfig: CommandBarModuleConfigType;
  onClose: () => void;
}

export const IframeContent = ({ config, settings, featureConfig, onClose }: IframeContentProps) => {
  const { name, module_configs: moduleConfig } = featureConfig;
  const { gated, url } = moduleConfig;
  const queryClient = useQueryClient();

  const { mutate, isSuccess, isPending } = useUpdateProspectMutation({
    onSuccess: () => {
      if (!settings.parent_url) return;

      queryClient.setQueryData(
        dynamicConfigDataKey(settings.parent_url),
        (oldData: ConfigurationApiResponse | undefined) => {
          if (!oldData) return oldData;

          const updateModule = (module: CommandBarModuleConfigType) =>
            module.id === featureConfig.id
              ? { ...module, module_configs: { ...module.module_configs, gated: false } }
              : module;

          return {
            ...oldData,
            command_bar: {
              ...oldData.command_bar,
              modules: (oldData.command_bar?.modules ?? []).map(updateModule),
            },
          };
        },
      );
    },
  });

  const [email, setEmail] = useState('');

  if (!url) {
    return null;
  }

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
    <PreviewDialog open title={name} onOpenChange={onClose}>
      {gated && !isSuccess ? (
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

            <Button type="submit" className="w-full" disabled={!email.trim()}>
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
export type { IframeContentProps };
