import PageContainer from '../../components/AgentManagement/PageContainer';
import Button from '@breakout/design-system/components/Button/index';
import ProfileAccountPassword from './ProfileAccountPassword';
import ProfilePicture from './ProfilePicture';
import InputFieldContainer from './InputFieldContainer';
import { PROFILE_DATA_FORM_FIELDS } from './utils';
import AdminProfilePageShimmer from '../../components/ShimmerComponent/AdminProfilePageShimmer';
import { useAdminProfile } from './useAdminProfile';

const AdminProfilePage = () => {
  const {
    form,
    isLoading,
    isUploadingProfilePicture,
    isSaving,
    profileData,
    hasChanges,
    handleSaveProfileDetails,
    handleProfilePictureUpload,
    handleProfilePictureDelete,
  } = useAdminProfile();

  const { setValue } = form;

  const handleProfileDataValueChange = (name: string, value: string) => {
    setValue(name as keyof typeof profileData, value, { shouldDirty: true });
  };

  if (isLoading) {
    return <AdminProfilePageShimmer numberOfFormFields={PROFILE_DATA_FORM_FIELDS.length} />;
  }

  return (
    <PageContainer className="gap-6" heading="Profile Settings" containerClassName="gap-6">
      <ProfilePicture
        profileImageUrl={profileData.profilePicture || ''}
        onUpload={handleProfilePictureUpload}
        onDelete={handleProfilePictureDelete}
        isUploading={isUploadingProfilePicture}
        isDeleting={isSaving}
      />
      {PROFILE_DATA_FORM_FIELDS.map((field) => (
        <InputFieldContainer
          key={field.name}
          name={field.name}
          label={field.label}
          placeholder={field.placeholder}
          value={profileData[field.valueKey as keyof typeof profileData] || ''}
          onChange={(e) => handleProfileDataValueChange(field.valueKey, e.target.value)}
        />
      ))}
      <div className="flex w-full flex-col gap-8">
        <div className="flex w-full justify-end">
          <Button
            id="profile-save-details-button"
            variant="primary"
            className="px-6"
            onClick={handleSaveProfileDetails}
            disabled={isSaving || !hasChanges}
          >
            {isSaving ? 'Saving...' : 'Save Details'}
          </Button>
        </div>
        <ProfileAccountPassword />
      </div>
    </PageContainer>
  );
};

export default AdminProfilePage;
