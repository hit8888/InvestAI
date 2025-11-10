import AdminLoginForm, { AdminLoginFormRef } from '@breakout/design-system/components/layout/AdminLoginForm';
import { useRef, useState } from 'react';
import useLoginWithEmailPassword from '../queries/mutation/useLoginWithEmailPassword';
import useGenerateOtp from '../queries/mutation/useGenerateOtp';
import useVerifyOtp from '../queries/mutation/useVerifyOtp';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { LoginFormValues } from '@meaku/core/types/admin/adminLogin';
import useGoogleSso from '../hooks/useGoogleSso';
import { handleLoginAndRedirection } from '../utils/authHelpers';
import { HelpCircle } from 'lucide-react';
import Typography from '@breakout/design-system/components/Typography/index';
import CopyToClipboardButton from '@breakout/design-system/components/layout/CopyToClipboardButton';
import SpinLoader from '@breakout/design-system/components/layout/SpinLoader';
import GoogleIcon from '@breakout/design-system/components/icons/google-icon';
import useAdminEventAnalytics from '../hooks/useAdminEventAnalytics';
import ANALYTICS_EVENT_NAMES from '@meaku/core/constants/analytics';

const LoginForm = () => {
  const { trackAdminEvent } = useAdminEventAnalytics();
  const { initAuth, authInProgress } = useGoogleSso();

  const formRef = useRef<AdminLoginFormRef>(null);

  const navigate = useNavigate();

  const [authMode, setAuthMode] = useState<'password' | 'generateOtp' | 'enterOtp' | 'needHelp'>('password');
  const [hasOtpBeenSent, setHasOtpBeenSent] = useState(false);

  const showPasswordField = authMode === 'password';
  const showGenerateOtpField = authMode === 'generateOtp';
  const showOtpField = authMode === 'enterOtp';
  const showNeedHelpField = authMode === 'needHelp';

  const { mutateAsync: loginWithEmailPassword, isPending: isLoginWithEmailPasswordPending } = useLoginWithEmailPassword(
    {
      /* eslint-disable @typescript-eslint/no-explicit-any */
      onSuccess: (data: any) => {
        trackAdminEvent(ANALYTICS_EVENT_NAMES.ADMIN_DASHBOARD.ADMIN_DASHBOARD_LOGIN, {
          login_method: 'email',
        });
        handleLoginAndRedirection(data.user, data.access, data.refresh, navigate);
      },
    },
  );

  const { mutateAsync: generateOtp, isPending: isGenerateOtpPending } = useGenerateOtp({
    onSuccess: () => {
      setAuthMode('enterOtp');
    },
  });

  const { mutateAsync: verifyOtp, isPending: isVerifyOtpPending } = useVerifyOtp({
    /* eslint-disable @typescript-eslint/no-explicit-any */
    onSuccess: (data: any) => {
      handleResetForm();
      trackAdminEvent(ANALYTICS_EVENT_NAMES.ADMIN_DASHBOARD.ADMIN_DASHBOARD_LOGIN, {
        login_method: 'otp',
      });
      handleLoginAndRedirection(data.user, data.access, data.refresh, navigate);
    },
    onError: (error) => {
      setHasOtpBeenSent(false);
      setAuthMode('generateOtp');
      handleResetForm();
      toast.error((error as any)?.response?.data?.error);
    },
  });

  const isLoading = isLoginWithEmailPasswordPending || isGenerateOtpPending || isVerifyOtpPending;

  const handleResetForm = () => {
    // Instead of directly setting state, passing a reset callback to AdminLoginForm
    if (formRef.current) {
      formRef.current?.reset();
      formRef.current.resetOTP();
    }
  };

  const handleLogin = async (values: LoginFormValues) => {
    switch (authMode) {
      case 'password':
        if (!values.email || !values.password) {
          toast.error('Please enter email and password.');
          return;
        }

        await loginWithEmailPassword({ email: values.email, password: values.password });
        break;
      case 'generateOtp':
        if (!values.email) {
          toast.error('Please enter email.');
          return;
        }

        await generateOtp({ email: values.email });
        setHasOtpBeenSent(true);
        break;
      case 'enterOtp':
        if (!values.email || !values.otp) {
          toast.error('Please enter email and OTP.');
          return;
        }
        await verifyOtp({ email: values.email, code: values.otp });
        break;
    }
  };

  const handleToggleShowOtpLogin = () => {
    if (authMode === 'enterOtp' || authMode === 'generateOtp') {
      setAuthMode('password');
    }

    if (authMode === 'password') {
      /* eslint-disable @typescript-eslint/no-unused-expressions */
      hasOtpBeenSent ? setAuthMode('enterOtp') : setAuthMode('generateOtp');
    }
    handleResetForm();
    setHasOtpBeenSent(false);
  };

  const handleReturnBack = () => {
    if (showOtpField) {
      setAuthMode('generateOtp');
      return;
    }

    setAuthMode('password');
  };

  return (
    <>
      <div className="flex w-full max-w-md flex-col justify-center gap-6">
        {(showOtpField || showNeedHelpField) && (
          <button
            className="absolute left-4 top-0 px-4 py-3 text-sm font-semibold text-primary"
            onClick={handleReturnBack}
          >
            Return back
          </button>
        )}
        <h1 className="self-stretch text-center text-[54px] font-semibold text-slate-800">
          {showNeedHelpField ? 'Need Help?' : 'Log in to Breakout'}
        </h1>
        {(showPasswordField || showGenerateOtpField) && (
          <div className="flex w-full flex-col items-center self-stretch">
            <div className="flex w-full rounded-custom-50 bg-gray-100 p-1">
              <button
                onClick={handleToggleShowOtpLogin}
                className={`flex-1 rounded-custom-50 px-4 py-2 text-sm font-medium ${
                  showPasswordField ? 'bg-white text-primary shadow' : 'text-gray-500'
                }`}
              >
                Login with password
              </button>
              <button
                onClick={handleToggleShowOtpLogin}
                className={`flex-1 rounded-custom-50 px-4 py-2 text-sm font-medium ${
                  showGenerateOtpField ? 'bg-white text-primary shadow' : 'text-gray-500'
                }`}
              >
                Log in with a code
              </button>
            </div>
          </div>
        )}

        {showNeedHelpField ? (
          <div className="flex flex-col items-center gap-4">
            <Typography variant="body-16" textColor="textSecondary" className="text-center">
              If you’re having trouble logging in or didn’t receive your verification code, reach out to our support
              team. We’re here to help!
            </Typography>
            <div className="flex items-center gap-6 rounded-2xl border bg-white p-2">
              <Typography variant="label-16-medium" textColor="primary">
                support@getbreakout.ai
              </Typography>
              <div className="rounded-lg border bg-primary/10">
                <CopyToClipboardButton textToCopy="support@getbreakout.com" />
              </div>
            </div>
          </div>
        ) : (
          <AdminLoginForm
            ref={formRef}
            handleLogin={handleLogin}
            showOtpField={showOtpField}
            showPasswordField={showPasswordField}
            isLoading={isLoading}
            submitBtnLabel={showOtpField ? 'Continue' : showGenerateOtpField ? 'Send Code' : 'Login'}
          />
        )}

        {showPasswordField && (
          <>
            <div className="flex w-full items-center gap-2 self-stretch">
              <hr className="flex-grow border-[#DCDAF8]" />
              <span className="text-sm text-slate-400">Or</span>
              <hr className="flex-grow border-[#DCDAF8]" />
            </div>
            <button
              onClick={initAuth}
              className="flex w-full items-center justify-center gap-2 self-stretch rounded-lg border border-gray-300 py-3 pl-2 pr-4 text-sm font-medium text-slate-800 hover:bg-gray-50"
            >
              {authInProgress ? (
                <SpinLoader width={5} height={5} />
              ) : (
                <>
                  <GoogleIcon />
                  Login with Google
                </>
              )}
            </button>
          </>
        )}
      </div>
      {!showNeedHelpField && (
        <button
          className="absolute bottom-0 left-1/2 flex -translate-x-1/2 items-center gap-1 text-sm font-normal text-primary/60"
          onClick={() => setAuthMode('needHelp')}
        >
          <HelpCircle className="h-4 w-4" />
          Need Help?
        </button>
      )}
    </>
  );
};

export default LoginForm;
