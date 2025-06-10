import LoginForm from '../../components/LoginForm';
import { Toaster } from 'react-hot-toast';
import QouteSlider from './components/QouteSlider';
import { QOUTE_SLIDES } from './constants';

const LoginPage = () => {
  return (
    <>
      <div className="relative flex h-screen min-h-[768px] w-full bg-[#FBFBFE] p-4">
        <div className="w-2/3">
          <div className="flex h-full w-full flex-col justify-between bg-[url(/dashboard-login-banner.png)] bg-[length:100%_100%] bg-no-repeat p-14 pb-20">
            <img src="/logo-white.svg" height={54} width={54} />
            <QouteSlider slides={QOUTE_SLIDES} />
          </div>
        </div>

        <div className="relative flex w-1/2 items-center justify-center px-[84px]">
          <LoginForm />
        </div>
      </div>
      <Toaster
        toastOptions={{
          duration: 2000,
        }}
      />
    </>
  );
};

export default LoginPage;
