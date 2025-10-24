import React, { useCallback } from 'react';
import Input from '@breakout/design-system/components/layout/input';
import AgentImageUpload from '../../BrandingPage/AgentImageUpload';
import AgentDropdown from '@breakout/design-system/components/Dropdown/AgentDropdown';
import URLLinkInput from '@breakout/design-system/components/layout/URLLinkInput';
import DeleteIcon from '@breakout/design-system/components/icons/delete-icon';
import { ACTION_OPTIONS, CTAData, CTAItemProps, FORM_OPTIONS } from '../utils/blockHelpers';
import Typography from '@breakout/design-system/components/Typography/index';

const AskAICTAItem: React.FC<CTAItemProps> = ({ cta, index, onUpdate, onDelete, disabled }) => {
  const handleIconUpdate = useCallback(
    (image: string) => {
      onUpdate(cta.id, { icon: image });
    },
    [cta.id, onUpdate],
  );

  const handleNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onUpdate(cta.id, { name: e.target.value });
    },
    [cta.id, onUpdate],
  );

  const handleActionChange = useCallback(
    (value: string | null) => {
      const action = value as CTAData['action'];
      onUpdate(cta.id, {
        action,
        // Clear dependent values when action changes
        formValue: action === 'trigger_form' ? cta.formValue : undefined,
        urlValue: action === 'redirect_url' ? cta.urlValue : undefined,
      });
    },
    [cta.id, onUpdate, cta.formValue, cta.urlValue],
  );

  const handleFormValueChange = useCallback(
    (value: string | null) => {
      onUpdate(cta.id, { formValue: value || undefined });
    },
    [cta.id, onUpdate],
  );

  const handleUrlValueChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onUpdate(cta.id, { urlValue: e.target.value });
    },
    [cta.id, onUpdate],
  );

  const handleDelete = useCallback(() => {
    onDelete(cta.id);
  }, [cta.id, onDelete]);

  return (
    <div className="flex w-full flex-col items-start gap-4">
      {/* CTA Header */}
      <Typography variant="label-14-medium" textColor="gray500">
        CTA #{index + 1}
      </Typography>
      <div className="flex w-full items-center gap-2 rounded-lg border border-gray-200 bg-gray-100 p-4">
        <div className="flex flex-1 flex-col items-start gap-4">
          {/* CTA Fields Row */}
          <div className="flex w-full items-center gap-4">
            {/* Icon Upload */}
            <div className="flex flex-shrink-0 flex-col items-start gap-2">
              <Typography variant="caption-12-medium">Icon</Typography>
              <AgentImageUpload
                width="44px"
                height="44px"
                isSquareLogo={true}
                initialImage={cta.icon}
                onImageUpdate={handleIconUpdate}
                tooltipText="Upload CTA icon"
              />
            </div>

            {/* Name Input */}
            <div className="flex flex-1 flex-col items-start gap-2">
              <Typography variant="caption-12-medium">Name</Typography>
              <Input
                value={cta.name}
                onChange={handleNameChange}
                placeholder="Book a Demo"
                disabled={disabled}
                className="h-11 w-full rounded-lg border-gray-300 px-3 py-3 text-sm focus:border-gray-300 focus:ring-4 focus:ring-gray-200"
              />
            </div>

            {/* Action Dropdown */}
            <div className="flex flex-1 flex-col items-start gap-2">
              <Typography variant="caption-12-medium">Action</Typography>
              <AgentDropdown
                options={ACTION_OPTIONS.map((opt) => opt.label)}
                placeholderLabel="Select Action"
                defaultValue={ACTION_OPTIONS.find((opt) => opt.value === cta.action)?.label}
                onCallback={(value) => {
                  const option = ACTION_OPTIONS.find((opt) => opt.label === value);
                  handleActionChange(option?.value || null);
                }}
                className="h-11 w-full rounded-lg px-3 py-2 text-sm"
                fontToShown="text-sm"
                dropdownOpenClassName="ring-4 ring-gray-200"
                menuContentAlign="end"
                menuContentSide="bottom"
                showIcon={false}
                menuItemClassName="p-3 text-sm"
                disableTrigger={disabled}
              />
            </div>
          </div>

          {/* Conditional Value Provider */}
          {cta.action === 'trigger_form' && (
            <div className="w-full">
              <AgentDropdown
                options={FORM_OPTIONS.map((opt) => opt.label)}
                placeholderLabel="Select Form"
                defaultValue={FORM_OPTIONS.find((opt) => opt.value === cta.formValue)?.label}
                onCallback={(value) => {
                  const option = FORM_OPTIONS.find((opt) => opt.label === value);
                  handleFormValueChange(option?.value || null);
                }}
                className="h-11 w-full rounded-lg px-3 py-2 text-sm"
                fontToShown="text-sm"
                dropdownOpenClassName="ring-4 ring-gray-200"
                menuContentAlign="end"
                menuContentSide="bottom"
                showIcon={false}
                menuItemClassName="p-3 text-sm"
                disableTrigger={disabled}
              />
            </div>
          )}

          {cta.action === 'redirect_url' && (
            <div className="w-full">
              <URLLinkInput
                inputValue={cta.urlValue || ''}
                onInputChange={handleUrlValueChange}
                classname="w-full"
                placeholder="https://www.example.com"
              />
            </div>
          )}
        </div>
        <button
          onClick={handleDelete}
          disabled={disabled}
          className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-red-50 disabled:opacity-50"
          type="button"
        >
          <DeleteIcon width="16" height="16" className="text-red-500" />
        </button>
      </div>
    </div>
  );
};

export default AskAICTAItem;
