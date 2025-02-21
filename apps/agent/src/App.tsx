import { RouterProvider } from 'react-router-dom';
import router from './router';
import { useInitializeSentry } from './useInitializeSentry';
import { WidgetModeProvider } from '@meaku/core/contexts/WidgetModeProvider';

function App() {
  useInitializeSentry();

  return (
    <WidgetModeProvider>
      <main>
        <RouterProvider router={router} />
      </main>
    </WidgetModeProvider>
  );
}

export default App;
