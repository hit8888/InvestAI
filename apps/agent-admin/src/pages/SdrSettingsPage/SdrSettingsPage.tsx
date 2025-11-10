import { useState, useMemo, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { useSessionStore } from '../../stores/useSessionStore';
import PageContainer from '../../components/AgentManagement/PageContainer';
import Card from '../../components/AgentManagement/Card';
import TextArea from '@breakout/design-system/components/TextArea/index';
import Button from '@breakout/design-system/components/Button/index';
import Typography from '@breakout/design-system/components/Typography/index';
import { cn } from '@breakout/design-system/lib/cn';
import useUpdateUserProfileMutation from '../../queries/mutation/useUpdateUserProfileMutation';

const SdrSettingsPage = () => {
  const userInfo = useSessionStore((state) => state.userInfo);
  const updateUserInfo = useSessionStore((state) => state.updateUserInfo);
  const tenantIdentifier = useSessionStore((state) => state.activeTenant);
  const existingMessage = userInfo?.default_hitl_join_message;

  // Generate default placeholder message if no message exists
  const placeholderMessage = useMemo(() => {
    const firstName = userInfo?.first_name;
    const currentTenantName = tenantIdentifier?.['tenant-name'];
    const currentOrganization = userInfo?.organizations?.find((org) => org['tenant-name'] === currentTenantName);
    const tenantName = tenantIdentifier?.['name'] || currentOrganization?.name || '{Tenant name}';
    return `Hi! I'm ${firstName ? `${firstName}, ` : ''}a Sales Rep with ${tenantName}. \nHow can I assist you today?`;
  }, [tenantIdentifier, userInfo?.first_name, userInfo?.organizations]);

  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState(existingMessage || '');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { mutate: updateMessage, isPending: isSaving } = useUpdateUserProfileMutation({
    onSuccess: () => {
      toast.success('Message saved successfully');
      setIsEditing(false);
      updateUserInfo({ default_hitl_join_message: message });
    },
    onError: (error) => {
      const errorMessage =
        (error.response?.data as { detail?: string })?.detail || error.message || 'Failed to save message';
      toast.error(errorMessage);
    },
  });

  // Focus and position cursor when entering edit mode
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      const length = textareaRef.current.value.length;
      textareaRef.current.setSelectionRange(length, length);
    }
  }, [isEditing]);

  // Reset message when existing message changes
  useEffect(() => {
    if (!isEditing) {
      setMessage(existingMessage || '');
    }
  }, [isEditing, existingMessage]);

  const handleSave = () => {
    if (!message.trim()) {
      toast.error('Message cannot be empty');
      return;
    }
    updateMessage({ data: { default_hitl_join_message: message } });
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  // Disable save button if the message is empty or the same as the existing message
  const isSaveDisabled =
    isSaving || (isEditing && !message.trim()) || (isEditing && message.trim() === (existingMessage || '').trim());

  return (
    <PageContainer heading="Sales Rep Settings">
      <div className="flex w-full flex-col gap-6">
        <Card background="GRAY25" border="GRAY200" className="gap-4">
          <div className="flex w-full flex-col gap-4">
            <Typography variant="label-16-medium" className="text-gray-900">
              Add a default intro message for you
            </Typography>

            <div className="flex w-full flex-row gap-4 rounded-lg border border-gray-300 bg-white px-4 py-3">
              <TextArea
                ref={textareaRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={!isEditing}
                className={cn(
                  'min-h-[56px] w-full resize-none rounded-none border-none p-0 text-sm leading-[20px] text-[#2D3454] placeholder:text-gray-400 focus:ring-0 disabled:cursor-default disabled:bg-transparent disabled:opacity-100',
                )}
                placeholder={existingMessage ? '' : placeholderMessage}
              />
            </div>

            <div className="flex w-full justify-end">
              <Button
                variant="primary"
                size="small"
                onClick={isEditing ? handleSave : handleEdit}
                disabled={isSaveDisabled}
                className="px-3 py-2"
              >
                {isSaving ? 'Saving...' : isEditing ? 'Save' : 'Edit'}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </PageContainer>
  );
};

export default SdrSettingsPage;
