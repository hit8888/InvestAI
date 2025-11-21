import AccountPasswordIcon from '@breakout/design-system/components/icons/account-password-icon';
import Card from '../../components/AgentManagement/Card';
import Typography from '@breakout/design-system/components/Typography/index';
import { Dialog, DialogContent, DialogTrigger } from '@breakout/design-system/components/layout/dialog';
import Button from '@breakout/design-system/components/Button/index';
import Input from '@breakout/design-system/components/layout/input';
import { PASSWORD_STATE_FIELDS } from './utils';
import useResetPasswordHelper from './useResetPasswordHelper';

const ProfileAccountPassword = () => {
  return (
    <Card className="flex flex-row items-center justify-between p-4">
      <div className="flex items-center justify-center gap-2">
        <AccountPasswordIcon />
        <Typography variant="label-14-medium">Account Password</Typography>
      </div>
      <ResetPasswordButton />
    </Card>
  );
};

const ResetPasswordButton = () => {
  const {
    showResetPasswordDialog,
    handleCloseDialog,
    setShowResetPasswordDialog,
    register,
    onSubmit,
    isLoading,
    getFieldError,
    canSubmit,
  } = useResetPasswordHelper();
  return (
    <Dialog open={showResetPasswordDialog} onOpenChange={setShowResetPasswordDialog}>
      <DialogTrigger asChild>
        <Button id="profile-reset-password-button" variant="secondary">
          Reset Password
        </Button>
      </DialogTrigger>
      <DialogContent className="fixed left-1/2 top-1/2 max-w-[420px] -translate-x-1/2 -translate-y-1/2 !gap-6 !rounded-2xl border border-gray-300 bg-white p-4 shadow-2xl">
        <div className="flex w-full flex-col gap-2">
          <Typography variant="title-24" align={'center'}>
            Reset Password
          </Typography>
          <Typography variant="body-16" align={'center'} textColor="gray500">
            Reset your password used to login to your dashboard
          </Typography>
        </div>
        <form onSubmit={onSubmit} className="flex w-full flex-col gap-6">
          <div className="flex w-full flex-col gap-6">
            {PASSWORD_STATE_FIELDS.map((field) => {
              const fieldError = getFieldError(field.valueKey);
              return (
                <div key={field.name} className="flex flex-col gap-1">
                  <Input
                    id={`profile-reset-password-${field.valueKey}-input`}
                    className={`w-full border bg-white px-4 py-3 text-customPrimaryText placeholder:text-gray-400 focus:ring-0 ${
                      fieldError
                        ? 'border-destructive-500 focus:border-destructive-500'
                        : 'border-gray-300 focus:border-gray-400'
                    }`}
                    type="password"
                    placeholder={field.placeholder}
                    disabled={isLoading}
                    {...register(field.valueKey)}
                  />
                  {fieldError && (
                    <Typography variant="body-16" textColor="error">
                      {fieldError}
                    </Typography>
                  )}
                </div>
              );
            })}
          </div>
          <div className="mt-2 flex w-full justify-between gap-6">
            <Button
              id="profile-reset-password-cancel-button"
              className="w-full"
              variant="secondary"
              type="button"
              onClick={handleCloseDialog}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              id="profile-reset-password-save-button"
              className="w-full"
              variant="primary"
              type="submit"
              disabled={isLoading || !canSubmit()}
            >
              {isLoading ? 'Changing Password...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileAccountPassword;
