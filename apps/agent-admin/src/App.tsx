import { RouterProvider } from 'react-router-dom';
import router from './router';
import { useInitializeSentry } from './useInitializeSentry';
import { Toaster } from 'react-hot-toast';
import { useSetDistinctIdOnAppMount } from '@meaku/core/hooks/useSetDistinctIdOnAppMount';

function App() {
  useInitializeSentry();
  useSetDistinctIdOnAppMount();

  return (
    <main>
      <RouterProvider router={router} />
      <Toaster
        toastOptions={{
          duration: 2000,
          className: '!max-w-full',
        }}
      />
    </main>
  );
}

export default App;
