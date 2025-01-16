import { RouterProvider } from 'react-router-dom';
import router from './router';
import { useInitializeSentry } from './useInitializeSentry';
import { Toaster } from 'react-hot-toast';

function App() {
  useInitializeSentry();

  return (
    <main>
      <RouterProvider router={router} />
      <Toaster
        toastOptions={{
          duration: 2000,
        }}
      />
    </main>
  );
}

export default App;
