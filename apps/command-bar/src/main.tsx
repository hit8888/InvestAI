import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from './App';
import RootContainer from './containers/RootContainer';
import './utils/sentry.ts';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RootContainer hostId={null}>
      <App />
    </RootContainer>
  </StrictMode>,
);
