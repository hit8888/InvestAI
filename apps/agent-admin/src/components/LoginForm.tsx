import AdminLoginForm, { AdminLoginFormRef } from '@breakout/design-system/components/layout/AdminLoginForm';
import { cn } from '@breakout/design-system/lib/cn';
import { useRef, useState } from 'react';
import useLoginWithEmailPassword from '../queries/mutation/useLoginWithEmailPassword';
import useGenerateOtp from '../queries/mutation/useGenerateOtp';
import useVerifyOtp from '../queries/mutation/useVerifyOtp';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';
import { AppRoutesEnum } from '../utils/constants';
import { setTenantIdentifier } from '@meaku/core/utils/index';
import SuccessToastMessage from '@breakout/design-system/components/layout/SuccessToastMessage';
import { LoginFormValues } from '@meaku/core/types/admin/adminLogin';

const LoginForm = () => {
  const { userInfo, login, saveTokens } = useAuth();

  const formRef = useRef<AdminLoginFormRef>(null);

  const navigate = useNavigate();

  const [authMode, setAuthMode] = useState<'password' | 'generateOtp' | 'enterOtp'>('password');
  const [hasOtpBeenSent, setHasOtpBeenSent] = useState(false);

  const showPasswordField = authMode === 'password';
  const showOtpField = authMode === 'enterOtp';

  const { mutateAsync: loginWithEmailPassword, isPending: isLoginWithEmailPasswordPending } = useLoginWithEmailPassword(
    {
      /* eslint-disable @typescript-eslint/no-explicit-any */
      onSuccess: (data: any) => {
        // console.log('🚀 ~ file: LoginForm.tsx:33 ~ }=useLoginWithEmailPassword ~ data:', data);
        saveTokens(data.access, data.refresh, data.user);
      },
    },
  );

  const { mutateAsync: generateOtp, isPending: isGenerateOtpPending } = useGenerateOtp({
    /* eslint-disable @typescript-eslint/no-explicit-any */
    onSuccess: (data: any) => {
      toast.custom(<SuccessToastMessage title={data.message} />, {
        position: 'top-center',
      });
      setAuthMode('enterOtp');
    },
  });

  const { mutateAsync: verifyOtp, isPending: isVerifyOtpPending } = useVerifyOtp({
    /* eslint-disable @typescript-eslint/no-explicit-any */
    onSuccess: (data: any) => {
      // console.log('🚀 ~ file: LoginForm.tsx:51 ~ data:', data);
      saveTokens(data.access, data.refresh, data.user);
    },
  });

  const isLoading = isLoginWithEmailPasswordPending || isGenerateOtpPending || isVerifyOtpPending;

  const handleResetForm = () => {
    // Instead of directly setting state, passing a reset callback to AdminLoginForm
    if (formRef.current) {
      formRef.current?.reset();
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
        handleLoginAndRedirection();
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
        handleLoginAndRedirection();
        break;
    }
  };

  const handleLoginAndRedirection = async () => {
    login();
    handleResetForm();

    // If the User have single organization,
    // we would set this as our admin_tenant_identifier and navigate to 'leads' page.
    // If the User have multiple organizations ,
    // user would navigate to 'dashboard page' to select single organization ,
    // based on the selection, user would move to 'leads' page.
    const org = userInfo?.organizations;
    if (org && org.length === 1) {
      setTenantIdentifier(org[0]);
      navigate(AppRoutesEnum.LEADS);
    } else {
      navigate('/');
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

  return (
    <div className="w-full">
      <AdminLoginForm
        ref={formRef}
        handleLogin={handleLogin}
        showOtpField={showOtpField}
        showPasswordField={showPasswordField}
        isLoading={isLoading}
        submitBtnLabel={authMode === 'generateOtp' ? 'Generate a Code' : 'Login'}
      />
      <div className="relative py-8">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-gray-400">Or</span>
        </div>
      </div>
      <div>
        <button
          //   variant="secondary"
          className={cn('gradient-text w-full text-lg font-normal 2xl:text-3xl')}
          onClick={handleToggleShowOtpLogin}
          disabled={isLoading}
        >
          {authMode === 'password' ? 'Login with OTP' : 'Login with Password'}
        </button>
      </div>
    </div>
  );
};

export default LoginForm;
