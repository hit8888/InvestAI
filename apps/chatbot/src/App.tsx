import { RouterProvider } from 'react-router-dom';
import router from './router';
import { useInitializeAmplitude } from './useInitializeAmplitude';
import { useInitializeSentry } from './useInitializeSentry';

function App() {
  useInitializeAmplitude();

  useInitializeSentry();

  return (
    <main>
      <RouterProvider router={router} />
    </main>
  );
}

export default App;
