import LoginForm from '../components/LoginForm';
import BreakoutLogoWhite from '@breakout/design-system/components/icons/breakout-logo-white';
import { Toaster } from 'react-hot-toast';

const LoginPage = () => {
  return (
    <>
      <div className="relative flex h-screen w-full items-center justify-center bg-indigo-200">
        <div className="flex items-center justify-center gap-2 text-white">
          <BreakoutLogoWhite className="mx-auto w-10/12 opacity-40" />
        </div>
        <div className="absolute flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-bold 2xl:text-[96px]">Login to the Admin Dashboard</h1>
            <div className="flex w-full min-w-[360px] flex-col items-center justify-center gap-12 py-6">
              <LoginForm />
            </div>
          </div>
        </div>
      </div>
      <Toaster />
    </>
  );
};

export default LoginPage;
