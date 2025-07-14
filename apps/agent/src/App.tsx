import { RouterProvider } from 'react-router-dom';
import router from './router';
import { useInitializeSentry } from './useInitializeSentry';
import { WidgetModeProvider } from '@meaku/core/contexts/WidgetModeProvider';
import DeviceManagerProvider from '@meaku/core/contexts/DeviceManagerProvider';

function App() {
  useInitializeSentry();

  return (
    <WidgetModeProvider>
      <DeviceManagerProvider>
        <main>
          <RouterProvider router={router} />
        </main>
      </DeviceManagerProvider>
    </WidgetModeProvider>
  );
}

export default App;
