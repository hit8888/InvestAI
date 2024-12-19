import { RouterProvider } from 'react-router-dom';
import router from './router';
import { useInitializeSentry } from './useInitializeSentry';

function App() {
  useInitializeSentry();

  return (
    <main>
      <RouterProvider router={router} />
    </main>
  );
}

export default App;
