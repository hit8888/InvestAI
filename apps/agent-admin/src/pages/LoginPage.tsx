import LoginForm from '../components/LoginForm';
import { Toaster } from 'react-hot-toast';

const LoginPage = () => {
  return (
    <>
      <div className="flex h-screen w-full bg-primary/10">
        <div className="relative flex w-2/3 flex-col justify-center gap-4 px-4 py-20">
          <div className="absolute top-0 w-full opacity-10">
            <img src="/logo.svg" width={'95%'} />
            {/* <span className="text-[156px] text-white">reakout</span> */}
          </div>
          <div className="flex w-full flex-col items-center justify-center gap-20 p-6 text-center">
            <h2 className="text-[72px] font-bold">
              <span className="gradient-text">Buyers want to buy their way not your way</span>
            </h2>
          </div>
        </div>
        <div className="flex w-1/2 items-start justify-center py-20">
          <div className="flex flex-col items-center justify-center gap-10">
            <div className="flex flex-col items-center justify-center">
              <h2 className="text-4xl font-bold">
                A<span className="gradient-text"> helping hand</span>,{' '}
                <span className="text-black">not a nuisance.</span>
              </h2>
              <p className="mt-4 text-lg text-gray-500">
                Breakout serves up the information that prospects want when they want it
              </p>
            </div>
            <div className="flex w-full flex-col items-center justify-center gap-6 px-16">
              <h1 className="gradient-text text-4xl font-bold 2xl:text-8xl">Login to Dashboard</h1>
              <div className="flex w-full flex-col items-center justify-center gap-12 rounded-2xl border border-primary/10 bg-primary/2.5 py-6 shadow-2xl">
                <LoginForm />
              </div>
            </div>
          </div>
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
