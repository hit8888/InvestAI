import SpinnerIcon from '@breakout/design-system/components/icons/spinner';
import { cn } from '@breakout/design-system/lib/cn';
import { useState } from 'react';
import useLoginWithEmailPassword from '../queries/mutation/useLoginWithEmailPassword';
import useGenerateOtp from '../queries/mutation/useGenerateOtp';
import useVerifyOtp from '../queries/mutation/useVerifyOtp';
import OtpInput from './OtpInput';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';
import { AppRoutesEnum } from '../utils/constants';

const LoginForm = () => {
  const { userInfo, login, saveTokens, setTenantIdentifier } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');

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
      console.log('🚀 ~ file: LoginForm.tsx:44 ~ data:', data);
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

  const handleLogin = async (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();

    // console.log("handlelogin", authMode);

    switch (authMode) {
      case 'password':
        if (!email || !password) {
          toast.error('Please enter email and password.');
          return;
        }

        await loginWithEmailPassword({ email, password });
        handleLoginAndRedirection();
        break;
      case 'generateOtp':
        if (!email) {
          toast.error('Please enter email.');
          return;
        }

        await generateOtp({ email });
        setHasOtpBeenSent(true);
        break;
      case 'enterOtp':
        if (!email || !otp) {
          toast.error('Please enter email and OTP.');
          return;
        }
        await verifyOtp({ email, code: otp });
        handleLoginAndRedirection();
        break;
    }
  };

  const handleLoginAndRedirection = async () => {
    login();
    setEmail('');
    setOtp('');

    // If the User have single organization,
    // we would set this as our tenant_identifier and navigate to 'leads' page.
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
  };

  const onOtpSubmit = (otp: string) => {
    setOtp(otp);
  };

  return (
    <div className="w-full">
      <form className="flex w-full flex-col gap-6 px-6" onSubmit={handleLogin}>
        <div className="flex w-full flex-col gap-6 text-left">
          <div className="flex w-full flex-col items-start justify-center gap-2 2xl:gap-8">
            <label htmlFor="email" className="text-sm font-bold 2xl:text-6xl">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="username@org.com"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              className="w-full rounded-xl border border-primary py-3 text-lg focus:border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary/30 2xl:py-4 2xl:text-3xl"
              value={email}
              onChange={(ev) => setEmail(ev.target.value)}
            />
          </div>

          {showPasswordField || showOtpField ? (
            <div className={cn('w-full px-1 transition-all duration-300')}>
              {showPasswordField ? (
                <div
                  className={cn(
                    'flex w-full transform flex-col items-start justify-center gap-2 transition-all duration-300 ease-in-out 2xl:gap-8',
                    {
                      'translate-y-0 opacity-100': showPasswordField,
                      '-translate-y-full opacity-0': !showPasswordField,
                    },
                  )}
                >
                  <label htmlFor="password" className="text-sm font-bold 2xl:text-6xl">
                    Password
                  </label>
                  <input
                    disabled={!showPasswordField}
                    id="password"
                    type="password"
                    placeholder="********"
                    className="w-full rounded-xl border border-primary py-3 text-lg focus:border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary/30 2xl:py-4 2xl:text-3xl"
                    value={password}
                    onChange={(ev: React.ChangeEvent<HTMLInputElement>) => setPassword(ev.target.value)}
                  />
                </div>
              ) : null}
              {showOtpField ? (
                <div
                  className={cn('flex transform flex-col items-center gap-4 transition-all duration-300 ease-in-out')}
                >
                  <label htmlFor="otp" className="text-lg">
                    Enter OTP sent to {email}
                  </label>
                  {/* TODOS NEED TO ADD THE INPUT-OTP COMPONENT - SHADCN UI COMPONENT */}
                  <OtpInput length={6} onOtpSubmit={onOtpSubmit} />
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
        <button
          className={cn(
            'flex items-center justify-center gap-1 text-lg font-normal 2xl:text-3xl',
            'rounded-lg bg-primary/80 px-6 py-3 text-white', // Base styles
            'hover:bg-primary', // Hover state
            'focus:ring-primary-300 focus:outline-none focus:ring-4 focus:ring-offset-2', // Focus styles
            {
              'disabled:cursor-not-allowed disabled:bg-primary/30': isLoading,
            }, // Disabled state
          )}
          disabled={isLoading}
        >
          {isLoading && <SpinnerIcon className="!h-5 !w-5 text-white" />}
          {authMode === 'generateOtp' ? 'Generate a Code' : 'Login'}
        </button>
      </form>
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
